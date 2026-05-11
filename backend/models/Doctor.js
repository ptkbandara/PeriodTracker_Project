const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    specialty: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: String, 
        default: '0.0' 
    },
    experience: { 
        type: String, 
        required: true 
    },
    province: { 
        type: String, 
        required: true 
    },
    district: { 
        type: String, 
        required: true 
    },
    hospital: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        default: '👨‍⚕️' 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Doctor', doctorSchema);