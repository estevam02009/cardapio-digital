import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
