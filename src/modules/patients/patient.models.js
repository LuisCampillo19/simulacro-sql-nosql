import mongoose from "mongoose";

const patientHistorySchema = new mongoose.Schema({
    patientEmail: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    appointments: [{
        appointmentId: { type: String, required: true },
        date: { type: Date },
        doctorName: { type: String },
        specialty: { type: String },
        treatmentDescription: { type: String },
        amountPaid: { type: Number }
    }]
}, { timestamps: true });

export default mongoose.model('PatientHistory', patientHistorySchema);