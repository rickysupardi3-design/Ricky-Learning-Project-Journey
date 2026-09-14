export const mockPosts = [
  {
    id: 1,
    title: "It's All Start From This Page",
    date: "September 13, 2026",
    excerpt: "Hello World! ",
    content: "Welcome to my first blog post. In this post, I will share my journey into the world of web development and how I started learning React. Stay tuned for more updates and insights!",
    
  
},
  {
    id: 2,
    title: "Episode 1 : Learning Python",
    date: "September 13, 2026",
    header1: "Day 1 Goal : Extract data from excel files using Python",
    problem1: "What is the Problem ? ",
    problem1_2: "The problem I am trying to solve is the data of crude assay in the Oil and Gas website has 30-50 excel files per website if you download one by one is to much time consuming. So I want to download all excel file and extract the data to transform it for further analysis.",
    context1: "Project Context : In this project I want to download and extract crude assay data from ExxonMobil website",
    url1 : "https://corporate.exxonmobil.com/what-we-do/energy-supply/crude-trading/crude-oil-assays#Energysupply",
    image: "/screenshot1.png",
    body1 : "1st Attempt : I import panda library and read the excel file using pandas.read_excel() function. Hope can manipulate the data just using the URL and pandas DataFrame library. But it's fail and only show result NaN (Not a Number).",
    conclusion1 : "Conclusion : Failed",
    image2: "/screenshot2.png",
    body2 : "2nd Attempt : ",
    front_body2 :"• I use ",
    underline1 : "request library ",
    underline2 : "os library ",
    body2_1 : "to download the excel file from the website and save it to my local machine.",
    body2_2 : "to direct the path to the folder where the excel files are saved.",
    conclusion2 : "Conclusion : Sucessfully download the excel files from the website and save it to my local machine. Now I can extract the data from the excel files using pandas library.",
    but1 :"But the problem is still not solved because I to download all the files simultaneously",
  }
];