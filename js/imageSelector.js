function getBotImage(scenario, metadata){

const text = (scenario + " " + metadata).toLowerCase();

if(text.includes("travel") || text.includes("trip") || text.includes("tour"))
return "images/travel.jpg";

if(text.includes("food") || text.includes("restaurant"))
return "images/food.jpg";

if(text.includes("career") || text.includes("job"))
return "images/career.jpg";

if(text.includes("fitness") || text.includes("workout"))
return "images/fitness.jpg";

if(text.includes("study") || text.includes("education"))
return "images/study.jpg";

if(text.includes("health") || text.includes("medical"))
return "images/medical.jpg";

return "images/default.jpg";

}