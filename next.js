import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const cuisines = [
  {
    name: "North Indian",
    image:
      "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/north_indian.png",
    isRecommendedForMealSuggestion: true,
  },
  {
    name: "South Indian",
    image:
      "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/south_indian.png",
    isRecommendedForMealSuggestion: false,
  },
  {
    name: "Chinese",
    image:
      "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/chinese.png",
    isRecommendedForMealSuggestion: true,
  },
  {
    name: "Italian",
    image:
      "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/italian.png",
    isRecommendedForMealSuggestion: false,
  },
  {
    name: "Continental",
    image:
      "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/continental.png",
    isRecommendedForMealSuggestion: false,
  },
];

function CuisineGrid() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🍴 Choose Your Cuisine
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cuisines.map((cuisine) => (
          <Card
            key={cuisine.name}
            className="rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 overflow-hidden"
          >
            <img
              src={cuisine.image}
              alt={cuisine.name}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{cuisine.name}</h2>
              {cuisine.isRecommendedForMealSuggestion && (
                <p className="text-green-600 text-sm font-medium mt-1">
                  ✅ Recommended for Meal Suggestion
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 shadow-md flex gap-4">
        <Link to="/" className="text-blue-600 font-medium">Home</Link>
        <Link to="/cuisines" className="text-blue-600 font-medium">Cuisines</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1 className="text-center mt-10 text-2xl">Welcome to Meal Suggestion App</h1>} />
        <Route path="/cuisines" element={<CuisineGrid />} />
      </Routes>
    </Router>
  );
}
