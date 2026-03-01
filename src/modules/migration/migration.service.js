import fs from 'fs';
import csv from 'csv-parser';
import { pool } from '../../config/mysql.js';
import patientModels from '../patients/patient.models.js';

export const proccessCsv = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        // file read csv
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    let appointmentAdded = 0;

                    for(const row of results){
                        
                        //TABLE PATIENTS
                        await pool.query(
                            `INSERT IGNORE INTO patients (patient_name, patient_email, patient_phone, patient_address) VALUES (?,?,?,?)`,
                            [row.patient_name, row.patient_email, row.patient_phone, row.patient_address]
                        );
                        
                        //TABLE DOCTORS
                        await pool.query(
                            `INSERT IGNORE INTO doctors (doctor_name, doctor_email, doctor_specialty) VALUES (?,?,?)`,
                            [row.doctor_name, row.doctor_email, row.specialty]
                        );

                        // TABLE INSURANCES
                        let ins_id = null;
                        if(row.insurance_provider !== 'SinSeguro'){
                            await pool.query(
                                `INSERT IGNORE INTO insurances (ins_name, ins_coverage_percentage) VALUES (?,?)`,
                                [row.insurance_provider, row.coverage_percentage]
                            );
                            const [insResult] = await pool.query(`SELECT ins_id FROM insurances WHERE ins_name = ?`, [row.insurance_provider]);
                            if(insResult.length > 0) ins_id = insResult[0].ins_id;  
                        }
                        const [patientResult] = await pool.query('SELECT patient_id FROM patients WHERE patient_email = ?', [row.patient_email]);
                        const [doctorResult] = await pool.query(`SELECT doctor_id FROM doctors WHERE doctor_email = ?`, [row.doctor_email]);

                        if(patientResult.length === 0 || doctorResult.length === 0) continue;

                        const patient_id = patientResult[0].patient_id;
                        const doctor_id = doctorResult[0].doctor_id;
                        
                        // TABLE APPOINTMENT
                        const [appoResult] = await pool.query(
                            `INSERT IGNORE INTO appointments
                            (appo_id, appo_date, patient_id, doctor_id, ins_id, treatment_code, treatment_description, treatment_cost, amount_paid) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [row.appointment_id, row.appointment_date, patient_id, doctor_id, ins_id, row.treatment_code, row.treatment_description, row.treatment_cost, row.amount_paid]
                        );

                        // add data appointment mongo 
                        if(appoResult.affectedRows > 0){
                            appointmentAdded++;

                            const newAppointmentForMongo = {
                                appointmentId: row.appointment_id,
                                date: row.appointment_date,
                                doctorName: row.doctor_name,
                                specialty: row.specialty,
                                treatmentDescription: row.treatment_description,
                                amountPaid: amount_paid
                            };

                            await patientModels.findOneAndUpdate(
                                { patientEmail: row.patient_email },
                                {
                                    $set: { patientName: row.patient_name },
                                    $push: { appointments: newAppointmentForMongo}
                                },
                                { upsert: true, new: true }
                            );
                        }
                    }

                    fs.unlinkSync(filePath);
                    resolve({ message: `Successful migration. Appointments added: ${appointmentAdded}`})
                } catch (err) {
                    console.error('Error procesando fila');
                    reject(err);
                }
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};