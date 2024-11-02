import mongoose, { Schema } from "mongoose";  

const PurchaseItemSchema = new Schema(  
  {  
    product_id: {  
      type: Schema.Types.ObjectId,  
      ref: "Products",  
      required: true,  
    },  
    purchase_order_id: {  
      type: Schema.Types.ObjectId,  
      ref: "PurchaseOrder",  
      required: true,  
    },  
    qty: {  
      type: Number,  
      required: true,  
      min: 1,  
    },  
    price: {  
      type: Number,  
      required: true,  
      min: 0,  
    },  
    discount: {  
      type: Number,  
      min: 0,  
      max: 100,  
      default: 0,  
    },  
    total_price: {  
      type: Number,  
      required: true,  
      default: 0,   
    },  
    comments: {  
      type: String,  
      maxlength: 500,  
      default: "",  
    },  
  },  
  { timestamps: true }  
);  

PurchaseItemSchema.pre('save', function (next) {  
  this.total_price = this.qty * this.price * (1 - this.discount / 100);  
  next();  
});  

export const PurchaseItem = mongoose.model("PurchaseItem", PurchaseItemSchema);