
import { ClassLevel, Subject, Language } from './types';
import { BookOpen, Calculator, Globe, FlaskConical, Languages, Leaf, ScrollText, Atom, Dna, FlaskRound, TrendingUp, Landmark, Laptop } from 'lucide-react';

export const SUBJECTS_CONFIG = [
  { id: Subject.Science, icon: FlaskConical, color: "bg-emerald-100 text-emerald-600", border: "border-emerald-200" },
  { id: Subject.Maths, icon: Calculator, color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
  { id: Subject.SocialStudies, icon: Globe, color: "bg-amber-100 text-amber-600", border: "border-amber-200" },
  { id: Subject.English, icon: BookOpen, color: "bg-rose-100 text-rose-600", border: "border-rose-200" },
  { id: Subject.Hindi, icon: Languages, color: "bg-orange-100 text-orange-600", border: "border-orange-200" },
  { id: Subject.EVS, icon: Leaf, color: "bg-lime-100 text-lime-600", border: "border-lime-200" },
  { id: Subject.History, icon: ScrollText, color: "bg-stone-100 text-stone-600", border: "border-stone-200" },
  { id: Subject.Geography, icon: Globe, color: "bg-cyan-100 text-cyan-600", border: "border-cyan-200" },
  
  // High School Subjects
  { id: Subject.Physics, icon: Atom, color: "bg-violet-100 text-violet-600", border: "border-violet-200" },
  { id: Subject.Chemistry, icon: FlaskRound, color: "bg-teal-100 text-teal-600", border: "border-teal-200" },
  { id: Subject.Biology, icon: Dna, color: "bg-pink-100 text-pink-600", border: "border-pink-200" },
  { id: Subject.Economics, icon: TrendingUp, color: "bg-green-100 text-green-600", border: "border-green-200" },
  { id: Subject.PoliticalScience, icon: Landmark, color: "bg-red-100 text-red-600", border: "border-red-200" },
  { id: Subject.ComputerScience, icon: Laptop, color: "bg-slate-100 text-slate-600", border: "border-slate-200" },
];

export const CLASS_LEVELS = Object.values(ClassLevel);

export const SUPPORTED_LANGUAGES = [
  { id: Language.English, name: "English", nativeName: "English" },
  { id: Language.Hindi, name: "Hindi", nativeName: "हिन्दी" },
  { id: Language.Marathi, name: "Marathi", nativeName: "मराठी" },
  { id: Language.Bengali, name: "Bengali", nativeName: "বাংলা" },
  { id: Language.Gujarati, name: "Gujarati", nativeName: "ગુજરાતી" },
  { id: Language.Tamil, name: "Tamil", nativeName: "தமிழ்" },
  { id: Language.Telugu, name: "Telugu", nativeName: "తెలుగు" },
  { id: Language.Kannada, name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { id: Language.Malayalam, name: "Malayalam", nativeName: "മലയാളം" },
  { id: Language.Punjabi, name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
];

export const CLASS_SUBJECTS_MAPPING: Record<ClassLevel, Subject[]> = {
  [ClassLevel.Class1]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.EVS],
  [ClassLevel.Class2]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.EVS],
  [ClassLevel.Class3]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.EVS, Subject.Science, Subject.SocialStudies],
  [ClassLevel.Class4]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.EVS, Subject.Science, Subject.SocialStudies],
  [ClassLevel.Class5]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.EVS, Subject.Science, Subject.SocialStudies],
  [ClassLevel.Class6]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.Science, Subject.History, Subject.Geography, Subject.SocialStudies],
  [ClassLevel.Class7]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.Science, Subject.History, Subject.Geography, Subject.SocialStudies],
  [ClassLevel.Class8]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.Science, Subject.History, Subject.Geography, Subject.SocialStudies],
  [ClassLevel.Class9]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.Physics, Subject.Chemistry, Subject.Biology, Subject.History, Subject.Geography, Subject.PoliticalScience, Subject.Economics, Subject.ComputerScience],
  [ClassLevel.Class10]: [Subject.English, Subject.Hindi, Subject.Maths, Subject.Physics, Subject.Chemistry, Subject.Biology, Subject.History, Subject.Geography, Subject.PoliticalScience, Subject.Economics, Subject.ComputerScience],
};

// Helper type for the nested structure
type TopicMapping = Partial<Record<Subject, string[]>>;

// ALIGNED WITH NCERT / CBSE SYLLABUS
export const SUGGESTED_TOPICS: Record<ClassLevel, TopicMapping> = {
  [ClassLevel.Class1]: {
    [Subject.English]: ["A Happy Child", "Three Little Pigs", "After a Bath", "The Bubble, the Straw and the Shoe", "One Little Kitten", "Once I Saw a Little Bird", "Mittu and the Yellow Mango", "Merry-Go-Round", "Circle", "Flying-Man"],
    [Subject.Hindi]: ["Jhula (झूला)", "Aam Ki Kahani (आम की कहानी)", "Aam Ki Tokri (आम की टोकरी)", "Patte Hi Patte (पत्ते ही पत्ते)", "Pakodi (पकौड़ी)", "Chuk-Chuk Gaadi (छुक-छुक गाड़ी)", "Rasoi Ghar (रसोईघर)", "Chuho! Meow So Rahi Hai", "Bandar Aur Gilhari", "Pagri (पगड़ी)"],
    [Subject.Maths]: ["Shapes and Space", "Numbers from One to Nine", "Addition", "Subtraction", "Numbers from Ten to Twenty", "Time", "Measurement", "Numbers from Twenty-one to Fifty", "Data Handling", "Patterns", "Numbers", "Money", "How Many"],
    [Subject.EVS]: ["About Me", "My Body Parts", "Our Sense Organs", "My Family", "My Home", "My School", "People Who Help Us", "Festivals", "Good Habits", "Safety Rules", "Air and Water", "Weather", "The Sky"],
  },
  [ClassLevel.Class2]: {
    [Subject.English]: ["First Day at School", "Haldi’s Adventure", "I am Lucky!", "I Want", "A Smile", "The Wind and the Sun", "Rain", "Storm in the Garden", "Zoo Manners", "Funny Bunny", "Mr. Nobody", "Curlylocks and the Three Bears", "On My Blackboard I can Draw", "Make it Shorter", "I am the Music Man"],
    [Subject.Hindi]: ["Oont Chala (ऊँट चला)", "Bhalu Ne Kheli Football (भालू ने खेली फुटबॉल)", "Myaun, Myaun!! (म्याऊँ, म्याऊँ!!)", "Adhik Balwan Kaun? (अधिक बलवान कौन?)", "Dost Ki Madad (दोस्त की मदद)", "Bahut Hua (बहुत हुआ)", "Meri Kitab (मेरी किताब)", "Titli Aur Kali (तितली और कली)", "Bulbul (बुलबुल)", "Meethi Sarangi (मीठी सारंगी)"],
    [Subject.Maths]: ["What is Long, What is Round?", "Counting in Groups", "How Much Can You Carry?", "Counting in Tens", "Patterns", "Footprints", "Jugs and Mugs", "Tens and Ones", "My Funday", "Add Our Points", "Lines and Lines", "Give and Take", "The Longest Step", "Birds Come, Birds Go", "How Many Ponytails?"],
    [Subject.EVS]: ["My Family and Friends", "Food We Eat", "Clothes We Wear", "Our House", "Places in Neighbourhood", "Plants Around Us", "Animals Around Us", "Transport and Communication", "Directions and Time", "Seasons"],
  },
  [ClassLevel.Class3]: {
    [Subject.English]: ["Good Morning", "The Magic Garden", "Bird Talk", "Nina and the Baby Sparrows", "Little by Little", "The Enormous Turnip", "Sea Song", "A Little Fish Story", "The Balloon Man", "The Yellow Butterfly", "Trains", "The Story of the Road", "Puppy and I", "Little Tiger, Big Tiger"],
    [Subject.Hindi]: ["Kakku (कक्कू)", "Shekhibaaz Makkhi (शेखीबाज़ मक्खी)", "Chand Wali Amma (चाँद वाली अम्मा)", "Man Karta Hai (मन करता है)", "Bahadur Bitto (बहादुर बित्तो)", "Humse Sab Kahte (हमसे सब कहते)", "Tip-Tipwa (टिप-टिपवा)", "Bandar Baant (बंदर बाँट)", "Kab Aaun (कब आऊँ)", "Kyunji-mal Aur Kaise-Caisliya (क्योंजीमल और कैसे-कैसलिया)"],
    [Subject.Maths]: ["Where to Look From", "Fun with Numbers", "Give and Take", "Long and Short", "Shapes and Designs", "Fun with Give and Take", "Time Goes On", "Who is Heavier?", "How Many Times?", "Play with Patterns", "Jugs and Mugs", "Can We Share?", "Smart Charts", "Rupees and Paise"],
    [Subject.EVS]: ["Poonam's Day Out", "The Plant Fairy", "Water O' Water!", "Our First School", "Chhotu's House", "Foods We Eat", "Saying without Speaking", "Flying High", "It's Raining", "What is Cooking", "From Here to There", "Work We Do", "Sharing Our Feelings", "The Story of Food", "Making Pots", "Games We Play", "Here Comes a Letter", "A House Like This", "Our Friends-Animals", "Drop by Drop", "Families can be Different", "Left-Right", "A Beautiful Cloth", "Web of Life"],
    [Subject.Science]: ["Living and Non-Living Things", "Parts of a Plant", "Animals: Feeding Habits", "Birds: Beaks and Claws", "Nesting Habits of Birds", "Human Body", "Safety and First Aid", "Matter: Solids, Liquids and Gases", "Light, Sound and Force", "The Earth, Sun, Moon and Stars"],
    [Subject.SocialStudies]: ["The Earth - Our Home", "How Our Earth Looks", "Our Country India", "States of India", "Food We Eat", "Clothes We Wear", "Festivals We Celebrate", "Occupations", "Means of Transport", "Means of Communication", "Early Humans"]
  },
  [ClassLevel.Class4]: {
    [Subject.English]: ["Wake Up!", "Neha’s Alarm Clock", "Noses", "The Little Fir Tree", "Run!", "Nasruddin’s Aim", "Why?", "Alice in Wonderland", "Don’t be Afraid of the Dark", "Helen Keller", "The Donkey", "I had a Little Pony", "The Milkman’s Cow", "Hiawatha", "The Scholar’s Mother Tongue", "A Watering Rhyme", "The Giving Tree", "Books", "Going to Buy a Book", "The Naughty Boy", "Pinocchio"],
    [Subject.Hindi]: ["Mann Ke Bhole Bhale Badal", "Jaisa Sawal Waisa Jawab", "Kirmich Ki Gaind", "Papa Jab Bacche The", "Dost Ki Poshak", "Naav Banao Naav Banao", "Daan Ka Hisaab", "Kaun?", "Swatantrata Ki Ore", "Thapp Roti Thapp Daal", "Padakku Ki Soojh", "Sunita Ki Pahiya Kursi", "Hudhud", "Muft Hi Muft"],
    [Subject.Maths]: ["Building with Bricks", "Long and Short", "A Trip to Bhopal", "Tick-Tick-Tick", "The Way The World Looks", "The Junk Seller", "Jugs and Mugs", "Carts and Wheels", "Halves and Quarters", "Play with Patterns", "Tables and Shares", "How Heavy? How Light?", "Fields and Fences", "Smart Charts"],
    [Subject.EVS]: ["Going to School", "Ear to Ear", "A Day with Nandu", "The Story of Amrita", "Anita and the Honeybees", "Omana’s Journey", "From the Window", "Reaching Grandmother’s House", "Changing Families", "Hu Tu Tu, Hu Tu Tu", "The Valley of Flowers", "Changing Times", "A River’s Tale", "Basva’s Farm", "From Market to Home", "A Busy Month", "Nandita in Mumbai", "Too Much Water, Too Little Water", "Abdul in the Garden", "Eating Together", "Food and Fun", "The World in my Home", "Pochampalli", "Home and Abroad", "Spicy Riddles", "Defence Officer: Wahida", "Chuskit Goes to School"],
    [Subject.Science]: ["Food - Our Basic Need", "Digestion", "Teeth and Microbes", "Adaptations in Plants", "Adaptations in Animals", "Life History of Animals", "Clothes", "Air, Water and Weather", "Safety First", "Force, Work and Energy", "The Solar System", "Our Environment"],
    [Subject.SocialStudies]: ["Our Country - India", "The Northern Mountains", "The Northern Plains", "The Great Indian Desert", "The Southern Plateaus", "The Coastal Plains and Islands", "Climate of India", "Soils of India", "Forests and Wildlife of India", "Water Resources of India", "Mineral Resources", "Agriculture", "Industries", "Transport and Communication", "Our Government"]
  },
  [ClassLevel.Class5]: {
    [Subject.English]: ["Ice-cream Man", "Wonderful Waste!", "Teamwork", "Flying Together", "My Shadow", "Robinson Crusoe", "Crying", "My Elder Brother", "The Lazy Frog", "Rip Van Winkle", "Class Discussion", "The Talkative Barber", "Topsy-turvy Land", "Gulliver’s Travels", "Nobody’s Friend", "The Little Bully", "Sing a Song of People", "Around the World", "Malu Bhalu", "Who Will be Ningthou?"],
    [Subject.Hindi]: ["Raakh Ki Rassi", "Faslon Ke Tyohar", "Khilonewala", "Nanha Fankar", "Jahan Chah Wahan Raah", "Chitti Ka Safar", "Dakie Ki Kahani, Kanwar Singh Ki Zubani", "Ve Bhi Kya Din The", "Ek Maa Ki Bebasi", "Ek Din Ki Badshahath", "Chawal Ki Rotiyan", "Guru Aur Chela", "Swami Ki Dadi", "Baagh Aaya Us Raat", "Bishan Ki Dileri", "Pani Re Pani", "Chhoti Si Hamari Nadi", "Chunauti Himalaya Ki"],
    [Subject.Maths]: ["The Fish Tale", "Shapes and Angles", "How Many Squares?", "Parts and Wholes", "Does it Look the Same?", "Be My Multiple, I'll be Your Factor", "Can You See the Pattern?", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths", "Area and its Boundary", "Smart Charts", "Ways to Multiply and Divide", "How Big? How Heavy?"],
    [Subject.EVS]: ["Super Senses", "A Snake Charmer’s Story", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Every Drop Counts", "Experiments with Water", "A Treat for Mosquitoes", "Up You Go!", "Walls Tell Stories", "Sunita in Space", "What if it Finishes...?", "A Shelter so High!", "When the Earth Shook!", "Blow Hot, Blow Cold", "Who will do this Work?", "Across the Wall", "No Place for Us?", "A Seed tells a Farmer’s Story", "Whose Forests?", "Like Father, Like Daughter", "On the Move Again"],
    [Subject.Science]: ["Reproduction in Plants", "Animals and their Lifestyle", "The Human Body (Bones and Muscles)", "Nervous System", "Food and Health", "Safety and First Aid", "Air and Water", "Rocks and Minerals", "Soil Conservation", "Moon and Artificial Satellites", "Natural Disasters", "Force, Energy and Simple Machines"],
    [Subject.SocialStudies]: ["Globes and Maps", "Parallels and Meridians", "Movements of the Earth", "Major Landforms", "Weather and Climate", "The Land of Dense Forests (DRC)", "The Land of Ice and Snow (Greenland)", "The Land of Sand (Saudi Arabia)", "The Treeless Grasslands (Prairies)", "Environmental Pollution", "Natural Disasters", "Transmitting Knowledge", "Transport", "Communication", "The United Nations", "India and the UN", "The British Raj", "The Freedom Struggle", "Winning Freedom"]
  },
  [ClassLevel.Class6]: {
    [Subject.Maths]: ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion", "Symmetry", "Practical Geometry"],
    [Subject.Science]: ["Food: Where Does It Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "The Living Organisms and Their Surroundings", "Motion and Measurement of Distances", "Light, Shadows and Reflections", "Electricity and Circuits", "Fun with Magnets", "Water", "Air Around Us", "Garbage In, Garbage Out"],
    [Subject.History]: ["What, Where, How and When?", "From Hunting–Gathering to Growing Food", "In the Earliest Cities", "What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic", "New Questions and Ideas", "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns", "Traders, Kings and Pilgrims", "New Empires and Kingdoms", "Buildings, Paintings and Books"],
    [Subject.Geography]: ["The Earth in the Solar System", "Globe: Latitudes and Longitudes", "Motions of the Earth", "Maps", "Major Domains of the Earth", "Major Landforms of the Earth", "Our Country – India", "India: Climate, Vegetation and Wildlife"],
    [Subject.SocialStudies]: ["Understanding Diversity", "Diversity and Discrimination", "What is Government?", "Key Elements of a Democratic Government", "Panchayati Raj", "Rural Administration", "Urban Administration", "Rural Livelihoods", "Urban Livelihoods"],
    [Subject.English]: ["Who Did Patrick's Homework?", "How the Dog Found Himself a New Master!", "Taro's Reward", "An Indian – American Woman in Space: Kalpana Chawla", "A Different Kind of School", "Who I Am", "Fair Play", "A Game of Chance", "Desert Animals", "The Banyan Tree"],
    [Subject.Hindi]: ["Vah Chidiya Jo", "Bachpan", "Nadan Dost", "Chand Se Thodi Si Gappe", "Aksharon Ka Mahatva", "Paar Nazar Ke", "Sathi Haath Badhana", "Aise Aise", "Ticket Album", "Jhansi Ki Rani", "Jo Dekhkar Bhi Nahi Dekhte", "Sansar Pustak Hai", "Main Sabse Chhoti Houn", "Lokgeet", "Naukar", "Van Ke Marg Mein", "Saans Saans Mein Baans"]
  },
  [ClassLevel.Class7]: {
    [Subject.Maths]: ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes"],
    [Subject.Science]: ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations of Animals to Climate", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and its Effects", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story"],
    [Subject.History]: ["Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons", "Tribes, Nomads and Settled Communities", "Devotional Paths to the Divine", "The Making of Regional Cultures", "Eighteenth-Century Political Formations"],
    [Subject.Geography]: ["Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "Natural Vegetation and Wildlife", "Human Environment – Settlement, Transport and Communication", "Human Environment Interactions – The Tropical and the Subtropical Region", "Life in the Temperate Grasslands", "Life in the Deserts"],
    [Subject.SocialStudies]: ["On Equality", "Role of the Government in Health", "How the State Government Works", "Growing up as Boys and Girls", "Women Change the World", "Understanding Media", "Markets Around Us", "A Shirt in the Market", "Struggles for Equality"],
    [Subject.English]: ["Three Questions", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes That Made Trees Bloom", "Quality", "Expert Detectives", "The Invention of Vita-Wonk", "Fire: Friend and Foe", "A Bicycle in Good Repair", "The Story of Cricket"],
    [Subject.Hindi]: ["Hum Panchhi Unmukt Gagan Ke", "Dadi Maa", "Himalaya Ki Betiyan", "Kathputli", "Mithaiwala", "Rakt Aur Hamara Sharir", "Papa Kho Gaye", "Sham Ek Kisan", "Chidiya Ki Bacchi", "Apurva Anubhav", "Rahim Ke Dohe", "Kancha", "Ek Tinka", "Khanpan Ki Badalti Tasveer", "Neelkant", "Bhor Aur Barkha", "Veer Kunwar Singh", "Sangharsh Ke Karan Main Tunukmizaz Ho Gaya", "Ashram Ka Anumanit Vyay"]
  },
  [ClassLevel.Class8]: {
    [Subject.Maths]: ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs", "Playing with Numbers"],
    [Subject.Science]: ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and The Solar System", "Pollution of Air and Water"],
    [Subject.History]: ["How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "When People Rebel (1857 and After)", "Weavers, Iron Smelters and Factory Owners", "Civilising the \"Native\", Educating the Nation", "Women, Caste and Reform", "The Making of the National Movement: 1870s--1947", "India After Independence"],
    [Subject.Geography]: ["Resources", "Land, Soil, Water, Natural Vegetation and Wildlife Resources", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources"],
    [Subject.SocialStudies]: ["The Indian Constitution", "Understanding Secularism", "Why do we need a Parliament?", "Understanding Laws", "Judiciary", "Understanding Our Criminal Justice System", "Understanding Marginalisation", "Confronting Marginalisation", "Public Facilities", "Law and Social Justice"],
    [Subject.English]: ["The Best Christmas Present in the World", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury’s Lapse of Memory", "The Summit Within", "This is Jody’s Fawn", "A Visit to Cambridge", "A Short Monsoon Diary", "The Great Stone Face – I", "The Great Stone Face – II"],
    [Subject.Hindi]: ["Dhwan", "Lakh Ki Chudiyan", "Bus Ki Yatra", "Deewano Ki Hasti", "Chitthiyon Ki Anuthi Duniya", "Bhagwan Ke Dakiye", "Kya Nirash Hua Jaye", "Yeh Sabse Kathin Samay Nahi", "Kabir Ki Sakhiyan", "Kaamchor", "Jab Cinema Ne Bolna Sikha", "Sudama Charit", "Jahan Pahiya Hai", "Akbari Lota", "Surdas Ke Pad", "Pani Ki Kahani", "Baaj Aur Saanp", "Top"]
  },
  [ClassLevel.Class9]: {
    [Subject.Maths]: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid’s Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron’s Formula", "Surface Areas and Volumes", "Statistics", "Probability"],
    [Subject.Physics]: ["Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound"],
    [Subject.Chemistry]: ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom"],
    [Subject.Biology]: ["The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Why Do We Fall Ill", "Natural Resources", "Improvement in Food Resources"],
    [Subject.History]: ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World"],
    [Subject.Geography]: ["India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population"],
    [Subject.PoliticalScience]: ["What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions", "Democratic Rights"],
    [Subject.Economics]: ["The Story of Village Palampur", "People as Resource", "Poverty as a Challenge", "Food Security in India"],
    [Subject.English]: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake and the Mirror", "My Childhood", "Packing", "Reach for the Top", "The Bond of Love", "Kathmandu", "If I Were You"],
    [Subject.Hindi]: ["Do Bailon Ki Katha", "Lhasa Ki Aur", "Upbhoktavad Ki Sanskriti", "Sawle Sapno Ki Yaad", "Nana Saheb Ki Putri", "Premchand Ke Phate Joote", "Mere Bachpan Ke Din", "Ek Kutta Aur Ek Maina", "Sakhiyan Aur Sabad", "Vaakh", "Sawaiye", "Kaidi Aur Kokila", "Gram Shree", "Megh Aaye", "Yamraj Ki Disha", "Bacche Kaam Par Ja Rahe Hain"]
  },
  [ClassLevel.Class10]: {
    [Subject.Maths]: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    [Subject.Physics]: ["Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy"],
    [Subject.Chemistry]: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements"],
    [Subject.Biology]: ["Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Our Environment", "Sustainable Management of Natural Resources"],
    [Subject.History]: ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World"],
    [Subject.Geography]: ["Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy"],
    [Subject.PoliticalScience]: ["Power Sharing", "Federalism", "Democracy and Diversity", "Gender, Religion and Caste", "Popular Struggles and Movements", "Political Parties", "Outcomes of Democracy", "Challenges to Democracy"],
    [Subject.Economics]: ["Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"],
    [Subject.English]: ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses – I", "The Hundred Dresses – II", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal"],
    [Subject.Hindi]: ["Surdas ke Pad", "Ram-Lakshman-Parshuram Samvad", "Savaiya - Kavitt", "Aatmkathya", "Utsah - Att Nahi Rahi Hai", "Yah Danturit Muskan - Fasal", "Chhaya Chuna Mat", "Kanyadan", "Sangatkar", "Netaji Ka Chashma", "Balgobin Bhagat", "Lakhnavi Andaz", "Manviya Karuna Ki Divya Chamak", "Ek Kahani Yeh Bhi", "Stri Shiksha Ke Virodhi Kutarko Ka Khandan", "Naubatkhana Mein Ibadat", "Sanskriti"]
  }
};
