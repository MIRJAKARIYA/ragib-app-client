// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

const categories = [
  { name: "Fans", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Phone Accessories", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Bags", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Shoes", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Jewelry", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Watches", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Mens Clothing", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Womens Clothing", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Beauty Products", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Sports & Fitness", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Eyewear", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Baby Items", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Office & School Supplies", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Seasonal Products", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
  { name: "Entertainment Items", icon: "https://img.icons8.com/fluency/48/shopping-bag.png" },
];

export default function Sidebar({ onClose,setCategory }) {
  return (
    <div className="space-y-2 p-4 ">
     <div className=" bg-white rounded-[15px]">
       {categories.map((cat) => (
        <Link
          key={cat.name}
          to={`/?category=${encodeURIComponent(cat.name)}`}
          onClick={()=>setCategory(cat.name)}
          className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
        >
          <img
            src={cat.icon}
            alt={cat.name}
            className="w-8 h-8 group-hover:scale-110 transition"
          />
          <span className="text-black font-medium">{cat.name}</span>
        </Link>
      ))}
     </div>
    </div>
  );
}