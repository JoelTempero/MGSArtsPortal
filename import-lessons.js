/**
 * MGS Arts Portal - Auto-generated Import Script
 * Generated from: Copy of Itinerant Music Lessons 2026.xlsx
 *
 * Run in the browser console while logged into the admin portal:
 *   1. Copy-paste this entire script
 *   2. Call: await runImport()
 *   3. Reload the page
 */

const STUDENTS = [
    {
        "name": "Ashton Gee",
        "email": "geea@middleton.school.nz",
        "year": null,
        "parentName": "Emma Gee",
        "parentEmail": "elnsmgee@hotmail.co.nz",
        "parentPhone": "272270802",
        "instruments": [
            "Bass"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Rocco Edwards",
        "email": "",
        "year": null,
        "parentName": "Summer Edwards",
        "parentEmail": "summereedwards@gmail.com",
        "parentPhone": "0226910197",
        "instruments": [
            "Bass"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jerrick Dhale Frasco Pia",
        "email": "jerrickpia@myyahoo.com",
        "year": null,
        "parentName": "Jeannette Frasco Pia",
        "parentEmail": "jeannettefrasco@yahoo.com",
        "parentPhone": "2041192544",
        "instruments": [
            "Bass",
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Hongrui (Ray) Qiu",
        "email": "",
        "year": null,
        "parentName": "Lian Xue",
        "parentEmail": "gracexue831219@gmail.com",
        "parentPhone": "02108374659",
        "instruments": [
            "Bass"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Karl Shi",
        "email": "Shik@middleton.school.nz",
        "year": null,
        "parentName": "Yetta Shi",
        "parentEmail": "Yettashi@gmail.com",
        "parentPhone": "0211750364",
        "instruments": [
            "Bass",
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Gedeon Tseng",
        "email": "henry.christinatseng@gmail.com",
        "year": null,
        "parentName": "Christina Tseng",
        "parentEmail": "henry.christinatseng@gmail.com",
        "parentPhone": "02102492040",
        "instruments": [
            "Bass"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Matthew Jaeger",
        "email": "jaegerm2@middleton.school.nz",
        "year": null,
        "parentName": "Debbie Jaeger",
        "parentEmail": "jaegerfamilynz@gmail.com",
        "parentPhone": "0272288348",
        "instruments": [
            "Digital music",
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Nate Birse",
        "email": "",
        "year": null,
        "parentName": "Lissa Birse",
        "parentEmail": "lissa@functiongroup.co.nz",
        "parentPhone": "021973973",
        "instruments": [
            "Digital music"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Joshua Festing",
        "email": "t.festing@gmail.com",
        "year": null,
        "parentName": "Toni Festing",
        "parentEmail": "t.festing@gmail.com",
        "parentPhone": "0275413050",
        "instruments": [
            "Digital music"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Asher Wallis",
        "email": "Wallisa@middleton.school.nz",
        "year": null,
        "parentName": "Geoff Wallis",
        "parentEmail": "geoff.emma@gmail.com",
        "parentPhone": "0276376355",
        "instruments": [
            "Bass"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Joshua Gerretsen",
        "email": "gerretsenj@middleton.school.nz",
        "year": null,
        "parentName": "Este Gerretsen",
        "parentEmail": "esteg7@gmail.com",
        "parentPhone": "021 084 59725",
        "instruments": [
            "Bass",
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Katrina Melody Watts",
        "email": "katrinawatts1948@gmail.com",
        "year": null,
        "parentName": "Jacqueline Watts",
        "parentEmail": "jacqui_honeypot@hotmail.com",
        "parentPhone": "02102717977",
        "instruments": [
            "Cello",
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Blake Wilson",
        "email": "",
        "year": null,
        "parentName": "Courtney Wilson",
        "parentEmail": "joshandcourtneyw@gmail.com",
        "parentPhone": "02102551988",
        "instruments": [
            "Cello"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Thomas You",
        "email": "yout@middleton.school.nz",
        "year": null,
        "parentName": "Fen Wang",
        "parentEmail": "Fenwang0822@gmail.com",
        "parentPhone": "02108015003",
        "instruments": [
            "Cello",
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Sara Wong",
        "email": "",
        "year": null,
        "parentName": "David Wong",
        "parentEmail": "dkp.wong@gmail.com",
        "parentPhone": "0272483327",
        "instruments": [
            "Cello"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Tahlia Trethowan",
        "email": "trethowant@middleton.school.nz",
        "year": null,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "0275058818",
        "instruments": [
            "Cello",
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Neeva Trethowan",
        "email": "",
        "year": null,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "0275058818",
        "instruments": [
            "Cello"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Eden McGowan",
        "email": "",
        "year": null,
        "parentName": "Kirsty McGowan",
        "parentEmail": "kjmcgowan8 @gmail.com",
        "parentPhone": "",
        "instruments": [
            "Cello"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Sarah Wang",
        "email": "",
        "year": null,
        "parentName": "Na Wang",
        "parentEmail": "wangna.chch@gmail.com",
        "parentPhone": "021880563",
        "instruments": [
            "Saxophone"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jayden Wang",
        "email": "elsahubo6@gmail.com",
        "year": null,
        "parentName": "Bo Hu",
        "parentEmail": "elsahubo6@gmail.com",
        "parentPhone": "0226905217",
        "instruments": [
            "Saxophone"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Raphael Lau",
        "email": "",
        "year": null,
        "parentName": "Rebecca Leung",
        "parentEmail": "rebeccamonki@gmail.com",
        "parentPhone": "02102784424",
        "instruments": [
            "Clarinet"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Grace Prince",
        "email": "Princeg@middleton.school.nz",
        "year": null,
        "parentName": "Maureen Prince",
        "parentEmail": "Maureenprince7@gmail.com",
        "parentPhone": "0211543884",
        "instruments": [
            "Saxophone"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Gabrielle Hsu",
        "email": "gabrielle.hsu.3070@gmail.com",
        "year": null,
        "parentName": "Angela Hsu",
        "parentEmail": "suisiu@yahoo.com",
        "parentPhone": "021688793",
        "instruments": [
            "Saxophone"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Kiah Ashwell",
        "email": "super.bluff@hotmail.com",
        "year": null,
        "parentName": "Bethany Ashwell",
        "parentEmail": "super.bluff@hotmail.com",
        "parentPhone": "0276306473",
        "instruments": [
            "Clarinet"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Liam Young",
        "email": "youngl4@middleton.school.nz",
        "year": null,
        "parentName": "Gina Young",
        "parentEmail": "markandgina@gmail.com",
        "parentPhone": "0212940947",
        "instruments": [
            "Saxophone",
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Sakura Ishii",
        "email": "ishiis@middleton.school.nz",
        "year": null,
        "parentName": "Nobuko Ishii",
        "parentEmail": "nobutiny@icloud.com",
        "parentPhone": "02902269914",
        "instruments": [
            "Saxophone"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ran Ishii",
        "email": "ishiir@middleton.school.nz",
        "year": null,
        "parentName": "Nobuko Ishii",
        "parentEmail": "nobutiny@icloud.com",
        "parentPhone": "02902269914",
        "instruments": [
            "Clarinet"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Aiden Son",
        "email": "",
        "year": null,
        "parentName": "Seunghyun Lee",
        "parentEmail": "hyun7022328@gmail.com",
        "parentPhone": "0211465191",
        "instruments": [
            "Clarinet"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Nathaniel Yip",
        "email": "",
        "year": null,
        "parentName": "Candy Lin",
        "parentEmail": "alexcandy.yip@gmail.com",
        "parentPhone": "0221090873",
        "instruments": [
            "Clarinet"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Cody Ballinger",
        "email": "ballingerc@middleton.school.nz",
        "year": null,
        "parentName": "Gemma Ballinger",
        "parentEmail": "frostette2@hotmail.com",
        "parentPhone": "021 157 5274",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Samuel Pellow",
        "email": "pellows2@middleton.school.nz",
        "year": null,
        "parentName": "Catherine Pellow",
        "parentEmail": "r.c.pellow@xtra.co.nz",
        "parentPhone": "0211054005",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Samuel Mattingley",
        "email": "",
        "year": null,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "instruments": [
            "Drums",
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Hyunu Lee",
        "email": "0407hjlee@gmail.com",
        "year": null,
        "parentName": "Hoyoung and Lorne Lee",
        "parentEmail": "hoyoungandlauren@gmail.com",
        "parentPhone": "0275187328",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Bianka Yang",
        "email": "",
        "year": null,
        "parentName": "Suli",
        "parentEmail": "Sgsuli@hotmail.com",
        "parentPhone": "0212699965",
        "instruments": [
            "Drums",
            "Guitar",
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Vincent campbell",
        "email": "",
        "year": null,
        "parentName": "Tiffany marshall",
        "parentEmail": "Tiffa@hotmail.co.nz",
        "parentPhone": "0211738495",
        "instruments": [
            "Drums",
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Isaac Moe",
        "email": "",
        "year": null,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jayden Alec Cortez",
        "email": "",
        "year": null,
        "parentName": "Jocelyn Cortez",
        "parentEmail": "Jaydenalex81@yahoo.com",
        "parentPhone": "0211480723",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Zechariah Si",
        "email": "",
        "year": null,
        "parentName": "Liena Si",
        "parentEmail": "miniko1943@gmail.com",
        "parentPhone": "0212161001",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jayden Watson",
        "email": "",
        "year": null,
        "parentName": "Bridget Watson",
        "parentEmail": "Bridgetmail@me.com",
        "parentPhone": "0211097110",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ellie Mae Jaquiery",
        "email": "nathandcarrie@yahoo.com",
        "year": null,
        "parentName": "Nathan Jaquiery",
        "parentEmail": "nathandcarrie@yahoo.com",
        "parentPhone": "0276283663",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ella-Rose McConnell",
        "email": "mcconnelle2@middleton.school.nz",
        "year": null,
        "parentName": "Jacqui McConnell",
        "parentEmail": "sjmcconnell4@gmail.com",
        "parentPhone": "0224236087",
        "instruments": [
            "Drums",
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jimmy Minty",
        "email": "Emily@mintdevelopments.co.nz",
        "year": null,
        "parentName": "Emily Minty",
        "parentEmail": "Emily@mintdevelopments.co.nz",
        "parentPhone": "021 810 702",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Nathan Parker",
        "email": "nabobnz@gmail.com",
        "year": null,
        "parentName": "Matthew Parker",
        "parentEmail": "matt.lesley.parker@gmail.com",
        "parentPhone": "02102279664",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Ethan Highsted",
        "email": "highstede2@middleton.school.nz",
        "year": null,
        "parentName": "Jo Highsted",
        "parentEmail": "jo.highsted@gmail.com",
        "parentPhone": "02102742245",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Austin Fletcher",
        "email": "",
        "year": null,
        "parentName": "Dawn Fletcher",
        "parentEmail": "dawnjean@gmail.com",
        "parentPhone": "021 254 5916",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "William Breeze",
        "email": "",
        "year": null,
        "parentName": "Faith Jeremiah",
        "parentEmail": "faith.jeremiah@hotmail.com",
        "parentPhone": "0210592300",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Avion Samuels",
        "email": "",
        "year": null,
        "parentName": "Wilfred Samuels",
        "parentEmail": "wilfred.samuels@hotmail.com",
        "parentPhone": "0220129047",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Joshua Ferguson",
        "email": "theyoungslime@hotmail.com",
        "year": null,
        "parentName": "Jeremy Ferguson",
        "parentEmail": "thefergclan@hotmail.com",
        "parentPhone": "021888751",
        "instruments": [
            "Drums",
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Jake van Tonder",
        "email": "",
        "year": null,
        "parentName": "Nanda Van Tonder",
        "parentEmail": "Nvantonder76@gmail.com",
        "parentPhone": "0211703974",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Austen Pope",
        "email": "austen.giani.pope@gmail.com",
        "year": null,
        "parentName": "Roland Pope",
        "parentEmail": "roland.pope@gmail.com",
        "parentPhone": "0272462036",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Paige Churton",
        "email": "",
        "year": null,
        "parentName": "Kim Churton",
        "parentEmail": "kimchurton@yahoo.co.nz",
        "parentPhone": "0211168138",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Samuel Chyn An Wong",
        "email": "",
        "year": null,
        "parentName": "David King Poh Wong",
        "parentEmail": "dkp.wong@gmail.com",
        "parentPhone": "0272483327",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Oliver pomare",
        "email": "thepomares@gmail.com",
        "year": null,
        "parentName": "Jo Pomare",
        "parentEmail": "thepomares@gmail.com",
        "parentPhone": "0272033051",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Reuben ure",
        "email": "Urer@middleton.school.nz",
        "year": null,
        "parentName": "Kirsty ure",
        "parentEmail": "Timandkirst@yahoo.co.nz",
        "parentPhone": "0223095269",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Ryan Chan",
        "email": "chanr@middleton.school.nz",
        "year": null,
        "parentName": "Charleen Chan",
        "parentEmail": "jc.chan08@gmail.com",
        "parentPhone": "021442172",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Thane Walker",
        "email": "walkert@middleton.school.nz",
        "year": null,
        "parentName": "Brittany Walker",
        "parentEmail": "walker.christchurch@gmail.com",
        "parentPhone": "0274690650",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Ethan Chan",
        "email": "chane6@middleton.school.nz",
        "year": null,
        "parentName": "Charleen Chan",
        "parentEmail": "jc.chan08@gmail.com",
        "parentPhone": "021442172",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Lucas Qiao",
        "email": "",
        "year": null,
        "parentName": "Ying Qiu",
        "parentEmail": "michael_qcs@hotmail.com",
        "parentPhone": "0211670957",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Theo Kench",
        "email": "",
        "year": null,
        "parentName": "Amelia Kench",
        "parentEmail": "ameliakench@gmail.com",
        "parentPhone": "0273051633",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Henry Scoulding",
        "email": "scoulding.h@middleton.school.nz",
        "year": null,
        "parentName": "Alice Scoulding",
        "parentEmail": "simon.scoulding@gmail.com",
        "parentPhone": "0226589739",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Flynn Atkinson",
        "email": "atkinsonf@middleton.school.nz",
        "year": null,
        "parentName": "Melanie Atkinson",
        "parentEmail": "mellyc999@gmail.com",
        "parentPhone": "0274692226",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Israel Couperus",
        "email": "couperusi@middleton.school.nz",
        "year": null,
        "parentName": "Joanna Couperus",
        "parentEmail": "ljcouperus@gmail.com",
        "parentPhone": "0274503833",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Nikhil Lal",
        "email": "Laln@middleton.school.nz",
        "year": null,
        "parentName": "Sonya Lal",
        "parentEmail": "Sonyanesh@yahoo.com",
        "parentPhone": "0211410791",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Aiden John Reynolds",
        "email": "aidenjohnreynolds@gmail.com",
        "year": null,
        "parentName": "Richard Reynolds",
        "parentEmail": "richard.reynolds@hamiltonjet.nz",
        "parentPhone": "022 658 1542",
        "instruments": [
            "Drums",
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Raymond Im",
        "email": "kangbin0417@gmail.com",
        "year": null,
        "parentName": "Cellina Yang",
        "parentEmail": "yangcellina78@naver.com",
        "parentPhone": "0274270730",
        "instruments": [
            "Drums",
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Rosemary Gerretsen",
        "email": "gerretsenr@middleton.school.nz",
        "year": null,
        "parentName": "Este Gerretsen",
        "parentEmail": "Esteg7@gmail.com",
        "parentPhone": "021 08459725",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Luke Baker",
        "email": "",
        "year": null,
        "parentName": "Brigit Baker",
        "parentEmail": "bakerfam2007@gmail.com",
        "parentPhone": "0274339504",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Levi Wallis",
        "email": "wallisl@middleton.school.nz",
        "year": null,
        "parentName": "Emma Wallis",
        "parentEmail": "geoff.emma@gmail.com",
        "parentPhone": "0274644545",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Ethan Clancey",
        "email": "",
        "year": null,
        "parentName": "Liesl Clancey",
        "parentEmail": "liesl.clancey@gmail.com",
        "parentPhone": "0276221512",
        "instruments": [
            "Drums",
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Sam Clancey",
        "email": "",
        "year": null,
        "parentName": "Liesl Clancey",
        "parentEmail": "liesl.clancey@gmail.com",
        "parentPhone": "0276221512",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Joseph Kuo",
        "email": "",
        "year": null,
        "parentName": "Grace Hsu",
        "parentEmail": "muhsinhsu@gmail.com",
        "parentPhone": "021523664",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Micah Atkinson",
        "email": "",
        "year": null,
        "parentName": "Melanie Atkinso",
        "parentEmail": "mellyc999@gmail.com",
        "parentPhone": "0274692226",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jedidiah Igot",
        "email": "Iah.Igot@gmail.com",
        "year": null,
        "parentName": "Edilenson Igot",
        "parentEmail": "Edilenson@gmail.com",
        "parentPhone": "0275120698",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Zara Tse",
        "email": "Zaratse@gmail.com",
        "year": null,
        "parentName": "Peggy Tsui",
        "parentEmail": "Peggytsui@gmail.com",
        "parentPhone": "852 90513963",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jayden Cortez",
        "email": "",
        "year": null,
        "parentName": "Jocelyn Cortez",
        "parentEmail": "Jaydenalex81@yahoo.com",
        "parentPhone": "0211480723",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Jonathan Lim",
        "email": "",
        "year": null,
        "parentName": "Emmelin Lee",
        "parentEmail": "emmelin.lee@gmail.com",
        "parentPhone": "021 939633",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Steve Lee",
        "email": "lees2@middlton.school.nz",
        "year": null,
        "parentName": "Christina Lee",
        "parentEmail": "hyun54385432@gmail.com",
        "parentPhone": "0275792474",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Oliver Owen",
        "email": "oweno@middleton.school.nz",
        "year": null,
        "parentName": "gareth owen",
        "parentEmail": "gjo@hotmail.co.nz",
        "parentPhone": "021755062",
        "instruments": [
            "Drums",
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Asher Thomas Drake",
        "email": "",
        "year": null,
        "parentName": "Andrew Drake",
        "parentEmail": "Andrew@drake.nz",
        "parentPhone": "0212567653",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Aiden Reynolds",
        "email": "Reynoldsa2@middleton.school.nz",
        "year": null,
        "parentName": "Tana Reynolds",
        "parentEmail": "Treynoldsrn@gmail.com",
        "parentPhone": "0226579492",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Roy Park",
        "email": "",
        "year": null,
        "parentName": "April Kim",
        "parentEmail": "bluezone1999@hanmail.net",
        "parentPhone": "02102263880",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Nathan Abin Jose",
        "email": "",
        "year": null,
        "parentName": "Pretty Sam",
        "parentEmail": "Elsa.pretty@gmail.com",
        "parentPhone": "022 155 9551",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Daniel Esterhuizen",
        "email": "esterhuize2@middleton.school.nz",
        "year": null,
        "parentName": "Angelique Esterhuizen",
        "parentEmail": "angelique_esterhuizen@yahoo.com",
        "parentPhone": "02041338637",
        "instruments": [
            "Drums"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Therese Surrey",
        "email": "surreyt@middleton.school.nz",
        "year": null,
        "parentName": "Vicki Surrey",
        "parentEmail": "surreyfamily2006@gmail.com",
        "parentPhone": "0272442152",
        "instruments": [
            "Flute"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Lime Park",
        "email": "",
        "year": null,
        "parentName": "April Kim",
        "parentEmail": "bluezone1999@hanmail.net",
        "parentPhone": "02102263880",
        "instruments": [
            "Flute"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ricky Wu",
        "email": "",
        "year": null,
        "parentName": "Can Wang",
        "parentEmail": "lukewu19850816@gmail.com",
        "parentPhone": "0275771874",
        "instruments": [
            "Flute",
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Aine Sugiyama",
        "email": "aine7898@icloud.com",
        "year": null,
        "parentName": "Haruna Murakami",
        "parentEmail": "excelnz.haruna@gmail.com",
        "parentPhone": "02041295986",
        "instruments": [
            "Flute",
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Annabelle Venter",
        "email": "ventera3@middleton.school.nz",
        "year": null,
        "parentName": "Phia Venter",
        "parentEmail": "Venterphia@gmail.com",
        "parentPhone": "0210475451",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Matthew Hentschel",
        "email": "Matthew.hentschel@outlook.co.nz",
        "year": null,
        "parentName": "Bridey Hentschel",
        "parentEmail": "bridey75@outlook.co.nz",
        "parentPhone": "0212564637",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Karston Davie",
        "email": "karston.davie@gmail.com",
        "year": null,
        "parentName": "Neeley Davie",
        "parentEmail": "brent.neeley.davie@gmail.com",
        "parentPhone": "0272477611",
        "instruments": [
            "Guitar",
            "Piano",
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Aida-Mae Auld",
        "email": "aidamaeauld@gmail.com",
        "year": null,
        "parentName": "Laura Auld",
        "parentEmail": "lauracauld@gmail.com",
        "parentPhone": "0211594373",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Travis Ballinger",
        "email": "",
        "year": null,
        "parentName": "Gemma Ballinger",
        "parentEmail": "frostette2@hotmail.com",
        "parentPhone": "0211575274",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Tom Robson",
        "email": "robsont@middleton.school.nz",
        "year": null,
        "parentName": "Geoff Robson",
        "parentEmail": "grobson23@gmail.com",
        "parentPhone": "0212522955",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Joshua John Scarrott",
        "email": "joshua.scarrott24@gmail.com",
        "year": null,
        "parentName": "Tracy Scarrott",
        "parentEmail": "tracey_scarrott1970@live.com",
        "parentPhone": "0278660044",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Micah Davis",
        "email": "Davism@middleton.school.nz",
        "year": null,
        "parentName": "Kelly Davis",
        "parentEmail": "daviskelly12@gmail.com",
        "parentPhone": "0211541256",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Pedro Pellizzari",
        "email": "",
        "year": null,
        "parentName": "Andrea Hollmann",
        "parentEmail": "andholl@gmail.com",
        "parentPhone": "0212637708",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Chanho Jeon",
        "email": "",
        "year": null,
        "parentName": "EunHyeLym",
        "parentEmail": "drem8001@gmail.com",
        "parentPhone": "0211398337",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ritsuki Kawai",
        "email": "ritsubobo2010@gmail.com",
        "year": null,
        "parentName": "Maiko Kawai",
        "parentEmail": "maiko_can@yahoo.co.jp",
        "parentPhone": "02108649260",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Sienna Ellena",
        "email": "Ellenas@middleton.school.nz",
        "year": null,
        "parentName": "Ruth Ellena",
        "parentEmail": "Timandruthellena@gmail.com",
        "parentPhone": "0276544999",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Lucy Penno",
        "email": "pennol@middleton.school.nz",
        "year": null,
        "parentName": "Joy Penno",
        "parentEmail": "joy.penno65@gmail.com",
        "parentPhone": "0221368326",
        "instruments": [
            "Guitar",
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Ezra Edwards",
        "email": "",
        "year": null,
        "parentName": "Summer Edwards",
        "parentEmail": "summereedwards@gmail.com",
        "parentPhone": "0226910197",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Rintaro YAMASHITA",
        "email": "sarukun1003.yamashita@gmail.com",
        "year": null,
        "parentName": "Haruna Murakami",
        "parentEmail": "excelnz.haruna@gmail.com",
        "parentPhone": "02041295986",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Sol Armstrong",
        "email": "armstrongs@ middleton.school.nz",
        "year": null,
        "parentName": "Elise Armstrong",
        "parentEmail": "elisearm@gmail.com",
        "parentPhone": "0211485400",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Blake Ramsay",
        "email": "ramsayb@middleton.school.nz",
        "year": null,
        "parentName": "Ruth Ramsay",
        "parentEmail": "kellandruth@ramsay.org.nz",
        "parentPhone": "0211121947",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Valeria Galaz",
        "email": "valeriafgalaz@gmail.com",
        "year": null,
        "parentName": "Yareni Duarte",
        "parentEmail": "yareni.duarte@gmail.com",
        "parentPhone": "0211594146",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Hanalei Siose",
        "email": "hanaleisiose@gmail.com",
        "year": null,
        "parentName": "Uta Siose",
        "parentEmail": "utahlicious@msn.com",
        "parentPhone": "0212644088",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Bella Wong",
        "email": "Bravtrust@gmail.com",
        "year": null,
        "parentName": "Vicky Ma",
        "parentEmail": "Bravtrust@gmail.com",
        "parentPhone": "0212288522",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ethan McConnell",
        "email": "ethansmc@outlook.com",
        "year": null,
        "parentName": "Jacqui McConnell",
        "parentEmail": "sjmcconnell4@gmail.com",
        "parentPhone": "0224236087",
        "instruments": [
            "Guitar",
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Taj Armstrong",
        "email": "armstrongt@middleton.school.nz",
        "year": null,
        "parentName": "Elise Armstrong",
        "parentEmail": "elisearm@gmail.com",
        "parentPhone": "0211485400",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Evie Brown",
        "email": "browne2@middleton.school.nz",
        "year": null,
        "parentName": "Lizzy Brown",
        "parentEmail": "lizzy.sisson@gmail.com",
        "parentPhone": "0212439445",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Luke Churton",
        "email": "churtonl@middleton.school.nz",
        "year": null,
        "parentName": "Kim Churton",
        "parentEmail": "kimchurton@yahoo.co.nz",
        "parentPhone": "0211168138",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "James Carpenter",
        "email": "carpenterj@middleton.school.nz",
        "year": null,
        "parentName": "Fleur Carpenter",
        "parentEmail": "bradandfleur@gmail.com",
        "parentPhone": "0277052308",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Naomi Roberts",
        "email": "robertsn2@middleton.school.nz",
        "year": null,
        "parentName": "Marion Roberts",
        "parentEmail": "marionelephant@gmail.com",
        "parentPhone": "0211869398",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Sam ure",
        "email": "Ures@middleton.school.nz",
        "year": null,
        "parentName": "Kirsty ure",
        "parentEmail": "Timandkirst@yahoo.co.nz",
        "parentPhone": "0223095269",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Monty Given",
        "email": "givenm@middleton.school.nz",
        "year": null,
        "parentName": "Andy and Suz Given",
        "parentEmail": "andygiven2@gmail.com",
        "parentPhone": "021 0625164",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Lillie Birse",
        "email": "",
        "year": null,
        "parentName": "Lissa Birse",
        "parentEmail": "lissa@functiongroup.co.nz",
        "parentPhone": "021973973",
        "instruments": [
            "Guitar",
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Grace Holah",
        "email": "",
        "year": null,
        "parentName": "Timmy Holah",
        "parentEmail": "timmy.holah@grace.org.nz",
        "parentPhone": "0273071555",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Adelia Orr",
        "email": "orra@middleton.school.nz",
        "year": null,
        "parentName": "Katherine Orr",
        "parentEmail": "dankatorr@gmail.com",
        "parentPhone": "0273748137",
        "instruments": [
            "Guitar",
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Maddie Wallis",
        "email": "wallism@middleton.school.nz",
        "year": null,
        "parentName": "Emma Wallis",
        "parentEmail": "geoff.emma@gmail.com",
        "parentPhone": "0274644545",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Isaac Cooper",
        "email": "",
        "year": null,
        "parentName": "Heather Cooper",
        "parentEmail": "heatherbulman@hotmail.com",
        "parentPhone": "0221768514",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Aaron Festing",
        "email": "",
        "year": null,
        "parentName": "Toni Festing",
        "parentEmail": "t.festing@gmail.com",
        "parentPhone": "0275413050",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Aspen Alessandra Barr",
        "email": "barra@middleton.school.nz",
        "year": null,
        "parentName": "Maria & Maverick Barr",
        "parentEmail": "salvebanatao@yahoo.com",
        "parentPhone": "02102282470",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Olive Hope",
        "email": "",
        "year": null,
        "parentName": "Jessica Hope",
        "parentEmail": "hope.jessicamarie@gmail.com",
        "parentPhone": "02102482313",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Anastasia Hardanava",
        "email": "Hardanavaa@gmail.com",
        "year": null,
        "parentName": "Veronica  Hardanava",
        "parentEmail": "Vhardanava@icloud.com",
        "parentPhone": "0211833318",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Malea Marsden",
        "email": "Malea.marsden@gmail.com",
        "year": null,
        "parentName": "Amy Marsden",
        "parentEmail": "Amyboss@temapua.com",
        "parentPhone": "021628362",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "isaac tilbury",
        "email": "tilburyi2@middleton.school.nz",
        "year": null,
        "parentName": "richard tilbury",
        "parentEmail": "richard.tilbury@hotmail.co.nz",
        "parentPhone": "0223404736",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Madeline Posthuma",
        "email": "posthumam@middleton.school.nz",
        "year": null,
        "parentName": "Michelle posthuma",
        "parentEmail": "amposthuma1@gmail.com",
        "parentPhone": "0274813888",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Lewis Posthuma",
        "email": "",
        "year": null,
        "parentName": "Michelle Posthuma",
        "parentEmail": "amposthuma1@gmail.com",
        "parentPhone": "0274813888",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "sara owen",
        "email": "owens@middleton.school.nz",
        "year": null,
        "parentName": "gareth owen",
        "parentEmail": "gjo@Hotmail.co.nz",
        "parentPhone": "021755062",
        "instruments": [
            "Guitar",
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Christine Jones",
        "email": "jonesc3@middleton.school.nz",
        "year": null,
        "parentName": "Laura Jones",
        "parentEmail": "roderick.laura@xtra.co.nz",
        "parentPhone": "0210317744",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Pedro Kaue Pellizzari",
        "email": "pellizzari@middleton.school.nz",
        "year": null,
        "parentName": "Andrea Hollmann",
        "parentEmail": "andholl@gmail.com",
        "parentPhone": "0212637708",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Sylvie Watson",
        "email": "",
        "year": null,
        "parentName": "Kristy Watson",
        "parentEmail": "tonykristyw@tson.nz",
        "parentPhone": "0212900797",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Eliana Edith Humphrey",
        "email": "humphreye@middleton.school.nz",
        "year": null,
        "parentName": "Hilary Humphrey",
        "parentEmail": "hilaryhumphreynz@gmail.com",
        "parentPhone": "0211127761",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Xin-Yang Ethan Shi",
        "email": "shie@middleton.schoo.nz",
        "year": null,
        "parentName": "Juliette Sun",
        "parentEmail": "juliette.sun@icloud.com",
        "parentPhone": "02102949588",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jerrick Dhale Pia",
        "email": "jerrickpia@gmail.com",
        "year": null,
        "parentName": "Jeannette Pia",
        "parentEmail": "jeannettefrasco@yahoo.com",
        "parentPhone": "02041192544",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Ephraim Sinclair",
        "email": "Ephraimrmsinclair@gmail.com",
        "year": null,
        "parentName": "Jodie Sinclair",
        "parentEmail": "Jodiehasse@hotmail.com",
        "parentPhone": "0274905720",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Leaongo Misa",
        "email": "",
        "year": null,
        "parentName": "Sel Misa",
        "parentEmail": "ms_misa @xtra.co.nz",
        "parentPhone": "",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Logan McDowell",
        "email": "",
        "year": null,
        "parentName": "Aimee McDowell",
        "parentEmail": "aimee @pulza.co.nz",
        "parentPhone": "",
        "instruments": [
            "Guitar"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Natalie Rin",
        "email": "",
        "year": null,
        "parentName": "Janelle Rin",
        "parentEmail": "Vjrin@live.com",
        "parentPhone": "0272797775",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "James Mattingley",
        "email": "",
        "year": null,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Abigail Mattingley",
        "email": "",
        "year": null,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Xavier Dendle",
        "email": "dendlex@middleton.school.nz",
        "year": null,
        "parentName": "Leanne Dendle",
        "parentEmail": "Teamdendle@gmail.com",
        "parentPhone": "0273730334",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Jaegar Yang",
        "email": "",
        "year": null,
        "parentName": "Suli",
        "parentEmail": "Sgsuli@hotmail.com",
        "parentPhone": "0212699965",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ella Wei",
        "email": "weie@middleton.school.nz",
        "year": null,
        "parentName": "Zhiliang Wei",
        "parentEmail": "jeff_wei55@hotmail.com",
        "parentPhone": "0226166001",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Amber Judkins",
        "email": "judkinsa@middleton.school.nz",
        "year": null,
        "parentName": "Rhonda Judkins",
        "parentEmail": "judkins.family@xtra.co.nz",
        "parentPhone": "0272792829",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Percy Read",
        "email": "",
        "year": null,
        "parentName": "Emma Read",
        "parentEmail": "Em.and.m.read@gmail.com",
        "parentPhone": "0211546793",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Matthew Smit",
        "email": "",
        "year": null,
        "parentName": "Maggie Smit",
        "parentEmail": "Maggiesmit@hotmail.co.za",
        "parentPhone": "021881080",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Phoenix Wiegersma",
        "email": "",
        "year": null,
        "parentName": "Olivia Wiegersma",
        "parentEmail": "Oliviawiegersma5@gmail.com",
        "parentPhone": "0211265722",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Cailin Heathcote",
        "email": "",
        "year": null,
        "parentName": "Claire Heathcote",
        "parentEmail": "chpsychologynz@gmail.com",
        "parentPhone": "0212437123",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Faith Emmanuelle Dotulong",
        "email": "faidot7@gmail.com",
        "year": null,
        "parentName": "Septi Oktaviani",
        "parentEmail": "septioktaviani.so@gmail.com",
        "parentPhone": "02108376112",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jack Uy",
        "email": "uypunlok@gmail.com",
        "year": null,
        "parentName": "Frank Uy",
        "parentEmail": "uypunlok@gmail.com",
        "parentPhone": "02040563888",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Reuben Gibbs",
        "email": "",
        "year": null,
        "parentName": "Michelle Gibbs",
        "parentEmail": "michelle.gibbs.nz@gmail.com",
        "parentPhone": "021903039",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Austin Posthuma",
        "email": "posthumaa@middleton.school.nz",
        "year": null,
        "parentName": "Michelle Posthuma",
        "parentEmail": "amposthuma1@gmail.com",
        "parentPhone": "0274813888",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jaden Konda",
        "email": "kondaj@middleton.school.nz",
        "year": null,
        "parentName": "Swetha Devaputra",
        "parentEmail": "Kondaswetha@gmail.com",
        "parentPhone": "0224733447",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Shelby Rose Jaquiery",
        "email": "nathandcarrie@yahoo.com",
        "year": null,
        "parentName": "nathan jaquiery",
        "parentEmail": "nathandcarrie@yahoo.com",
        "parentPhone": "0276283663",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Mara Verdes",
        "email": "",
        "year": null,
        "parentName": "Isabela Verdes",
        "parentEmail": "bella0577@yahoo.com",
        "parentPhone": "0210582067",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Bennett France",
        "email": "",
        "year": null,
        "parentName": "Alicia France",
        "parentEmail": "aliciagracefrance@gmail.com",
        "parentPhone": "021782655",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Zephath Wasa",
        "email": "",
        "year": null,
        "parentName": "Yinasim Alibe",
        "parentEmail": "yinasimlawi@gmail.com",
        "parentPhone": "0226440729",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ava Catacutan",
        "email": "",
        "year": null,
        "parentName": "Rose Ann Santos",
        "parentEmail": "rosseyanne.1714@gmail.com",
        "parentPhone": "0212761120",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Mila Rose Humphrey",
        "email": "",
        "year": null,
        "parentName": "Hilary Humphrey",
        "parentEmail": "hilaryhumphreynz@gmail.com",
        "parentPhone": "0211127761",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Charlotte Pelotin",
        "email": "",
        "year": null,
        "parentName": "Jacqueline Pelotin",
        "parentEmail": "1jpelotin@gmail.com",
        "parentPhone": "021 02993157",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Caitlin Goodall",
        "email": "",
        "year": null,
        "parentName": "Joelle Goodall",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Amelia Goodall",
        "email": "",
        "year": null,
        "parentName": "Joelle Goodall",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Mya Reynolds",
        "email": "",
        "year": null,
        "parentName": "Ambra Reynolds",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Samuel Hurren",
        "email": "",
        "year": null,
        "parentName": "Rachael Hurren",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Charlie Watson",
        "email": "",
        "year": null,
        "parentName": "Kirsty Watson",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Marcus Neyra",
        "email": "",
        "year": null,
        "parentName": "Michelle Neyra",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jasmine Cornish",
        "email": "",
        "year": null,
        "parentName": "Sara Cornish",
        "parentEmail": "",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Lydia Cole",
        "email": "colel@middleton.school.nz",
        "year": null,
        "parentName": "Kendyl Cole",
        "parentEmail": "kendylcole87@gmail.com",
        "parentPhone": "021 852461",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Mark Ewing",
        "email": "",
        "year": null,
        "parentName": "Alecia Ewing",
        "parentEmail": "aleciaewing137@gmail.com",
        "parentPhone": "027 214 4610",
        "instruments": [
            "piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Sophie Pellow",
        "email": "pellows@middleton.school.nz",
        "year": null,
        "parentName": "Catherine Pellow",
        "parentEmail": "r.c.pellow@xtra.co.nz",
        "parentPhone": "0211054005",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Arden Monk",
        "email": "",
        "year": null,
        "parentName": "Jaimie Monk",
        "parentEmail": "jaimie.monk@outlook.com",
        "parentPhone": "021963291",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Billy Minty",
        "email": "Emily@mintdevelopments.co.nz",
        "year": null,
        "parentName": "Emily Minty",
        "parentEmail": "Emily@mintdevelopments.co.nz",
        "parentPhone": "021 810 702",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ihaia Hikuroa",
        "email": "",
        "year": null,
        "parentName": "Melanie Hikuroa",
        "parentEmail": "handlingmany@gmail.com",
        "parentPhone": "027 245 1997",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Tiaho Maia Hikuroa",
        "email": "",
        "year": null,
        "parentName": "Melanie Hikuroa",
        "parentEmail": "handlingmany@gmail.com",
        "parentPhone": "027 245 1997",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Angelique Higgins",
        "email": "",
        "year": null,
        "parentName": "Jane Archbold",
        "parentEmail": "jane@peterdiver.co.nz",
        "parentPhone": "021577995",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Zoe Zheng",
        "email": "",
        "year": null,
        "parentName": "Bob Zheng",
        "parentEmail": "zbob0706@gmail.com",
        "parentPhone": "0274377779",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Gabriel Perry",
        "email": "",
        "year": null,
        "parentName": "Imelda Perry",
        "parentEmail": "Imeeperry@gmail.com",
        "parentPhone": "0212120997",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Sophia koshchienko",
        "email": "Margarita8koshchienko@gmail.com",
        "year": null,
        "parentName": "Margarita koshchienko",
        "parentEmail": "Margarita8koshchienko@gmail.com",
        "parentPhone": "02108282804",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Olivia Kan",
        "email": "olivia.kan@outlook.co.nz",
        "year": null,
        "parentName": "rachel kan",
        "parentEmail": "rachel.kan@live.com",
        "parentPhone": "02102252145",
        "instruments": [
            "Flute"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Valeria Galaz Duarte",
        "email": "galazduart@middleton.school.nz",
        "year": null,
        "parentName": "Yareni Duarte Perea",
        "parentEmail": "yareni.duarte@gmail.com",
        "parentPhone": "0211594146",
        "instruments": [
            "Flute"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Moses petla",
        "email": "Benjaminsudhanewzealand@ gmail.com",
        "year": null,
        "parentName": "Sudha petla",
        "parentEmail": "Benjaminsudhanewzealand@gmail.com",
        "parentPhone": "0224355844",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Henco Sebastiaan de Nysschen",
        "email": "",
        "year": null,
        "parentName": "Elize de Nysschen",
        "parentEmail": "elize.denysschen@gmail.com",
        "parentPhone": "0273138708",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Grace Maheswari",
        "email": "",
        "year": null,
        "parentName": "Wilda Ribka",
        "parentEmail": "ribkawilda @gmail.com",
        "parentPhone": "",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Eli Highsted",
        "email": "",
        "year": null,
        "parentName": "Jo Highsted",
        "parentEmail": "jo.highsted@gmail.com",
        "parentPhone": "02102742245",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jemima Scoulding",
        "email": "",
        "year": null,
        "parentName": "Alice Scoulding",
        "parentEmail": "simon.scoulding@gmail.com",
        "parentPhone": "0226589739",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Alice Caitlyn Au",
        "email": "",
        "year": null,
        "parentName": "Rebekah Ruth Au",
        "parentEmail": "Beks98@gmail.com",
        "parentPhone": "0276342995",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Jordan Lucas Au",
        "email": "",
        "year": null,
        "parentName": "Rebekah Ruth Au",
        "parentEmail": "Beks98@gmail.com",
        "parentPhone": "0276342995",
        "instruments": [
            "Piano"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ayala Moe",
        "email": "moea@middleton.school.nz",
        "year": null,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "instruments": [
            "Trumpet",
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Joshua Judkins",
        "email": "judkinsj@middleton.school.nz",
        "year": null,
        "parentName": "Rhonda Judkins",
        "parentEmail": "judkins.family@xtra.co.nz",
        "parentPhone": "0272792829",
        "instruments": [
            "Trombone"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Jasper Read",
        "email": "Readj@middleton.school.nz",
        "year": null,
        "parentName": "Emma Read",
        "parentEmail": "Em.and.m.read@gmail.com",
        "parentPhone": "0211546793",
        "instruments": [
            "Trumpet"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Ephraim Couperus",
        "email": "11",
        "year": null,
        "parentName": "Joanna Couperus",
        "parentEmail": "ljcouperus@gmail.com",
        "parentPhone": "0274503833",
        "instruments": [
            "Trumpet"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Anastasia Wright",
        "email": "Wrighta@middleton.school.nz",
        "year": null,
        "parentName": "Elsa Wright",
        "parentEmail": "elsybear@gmail.com",
        "parentPhone": "02040911911",
        "instruments": [
            "Trombone"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Kira Weston",
        "email": "Westonk@middleton.school.nz",
        "year": null,
        "parentName": "Sophia Weston",
        "parentEmail": "Gns4life@gmail.com",
        "parentPhone": "02102536884",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Daniel Yeo",
        "email": "daniel@yeoz.com",
        "year": null,
        "parentName": "Chwee-Wei Chan",
        "parentEmail": "chwee@yeoz.com",
        "parentPhone": "0223936614",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Verity Oldham",
        "email": "",
        "year": null,
        "parentName": "Briarne Oldham",
        "parentEmail": "markandbri@gmail.com",
        "parentPhone": "027 460 1575",
        "instruments": [
            "Violin",
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Abigail Zarah Iyjo",
        "email": "",
        "year": null,
        "parentName": "Sumi Issac",
        "parentEmail": "Sumi.iyjo@gmail.com",
        "parentPhone": "02102886457",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Eliana Chyn Hui Wong",
        "email": "",
        "year": null,
        "parentName": "David King Poh Wong",
        "parentEmail": "dkp.wong@gmail.com",
        "parentPhone": "0272483327",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Grace Maheswari",
        "email": "-",
        "year": null,
        "parentName": "Wilda Ribka",
        "parentEmail": "ribkawilda@gmail.com",
        "parentPhone": "02040120212",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Joseph Su",
        "email": "suj@middleton.school.nz",
        "year": null,
        "parentName": "Eve Wu",
        "parentEmail": "Minwueve@mail.com",
        "parentPhone": "02108341898",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Addison Trethowan",
        "email": "",
        "year": null,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "027 505 8818",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Evie Hope",
        "email": "",
        "year": null,
        "parentName": "Jessica Hope",
        "parentEmail": "hope.jessicamarie@gmail.com",
        "parentPhone": "02102482313",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Zoe Fyfe",
        "email": "fyfez@middleton.school.nz",
        "year": null,
        "parentName": "Vivienne Fyfe",
        "parentEmail": "fyfewhanau@gmail.com",
        "parentPhone": "0211089327",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Grant Su",
        "email": "",
        "year": null,
        "parentName": "Min Wu",
        "parentEmail": "minwueve@gmail.com",
        "parentPhone": "021 083 41898",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Joseph Su",
        "email": "",
        "year": null,
        "parentName": "Min Wu",
        "parentEmail": "minwueve@gmail.com",
        "parentPhone": "021 083 41898",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Eliana Wong",
        "email": "",
        "year": null,
        "parentName": "Mei Hsien Ho Joyce",
        "parentEmail": "meihsienh@yahoo.co.nz",
        "parentPhone": "021 103 1201",
        "instruments": [
            "Violin"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Wilf Lowe",
        "email": "lowew@middleton.school.nz",
        "year": null,
        "parentName": "Megan Lowe",
        "parentEmail": "megs_lowe@yahoo.co.nz",
        "parentPhone": "021454912",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Zoey Harrison",
        "email": "harrisonz2@middleton.school.nz",
        "year": null,
        "parentName": "Mrs Lisa Harrison",
        "parentEmail": "justinharrison@yahoo.com",
        "parentPhone": "021 305 310",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Jasmine Xie",
        "email": "",
        "year": null,
        "parentName": "Shan Sun(Fiona)",
        "parentEmail": "sunshan0323@gmail.com",
        "parentPhone": "02108515665",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Keziah's Horn",
        "email": "hornk@middleton.school.nz",
        "year": null,
        "parentName": "Rhian Horn",
        "parentEmail": "Rhian.horn@gmail.com",
        "parentPhone": "0279644289",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Carla van der Nest",
        "email": "vandernest@Middleton.school",
        "year": null,
        "parentName": "Riaan van der Nest",
        "parentEmail": "Riaan@vdNest.co.nz",
        "parentPhone": "021461472",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Isabel Moe",
        "email": "moei@middleton.school.nz",
        "year": null,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Mia Wang",
        "email": "",
        "year": null,
        "parentName": "Na Wang",
        "parentEmail": "wangna.chch@gmail.com",
        "parentPhone": "021880563",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Anja Jennings",
        "email": "",
        "year": null,
        "parentName": "Sisi Zhuang",
        "parentEmail": "sisijennings5@gmail.com",
        "parentPhone": "0273053713",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Elysia Hartstonge",
        "email": "elysia.hartstonge@gmail.com",
        "year": null,
        "parentName": "Matthew Hartstonge",
        "parentEmail": "matt.hartstonge@gmail.com",
        "parentPhone": "02102795686",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Emma Wu",
        "email": "",
        "year": null,
        "parentName": "Xin Wu",
        "parentEmail": "abc100111310@hotmail.com",
        "parentPhone": "0212606121",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "imri dinnissen",
        "email": "",
        "year": null,
        "parentName": "Helena Dinnissen",
        "parentEmail": "ahdfamily@gmail.com",
        "parentPhone": "0276415474",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Bree Bennetts",
        "email": "Bennettsb@middleton.school.nz",
        "year": null,
        "parentName": "Jo Bennetts",
        "parentEmail": "Bennettsfamilynz@gmail.com",
        "parentPhone": "0211453511",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Quinn Dendle",
        "email": "Dendleq@middleton.school.nz",
        "year": null,
        "parentName": "Leanne Dendle",
        "parentEmail": "Teamdendle@gmail.com",
        "parentPhone": "0273730334",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Lienka Muller",
        "email": "Year10",
        "year": null,
        "parentName": "Elanza Muller",
        "parentEmail": "elanza@playball.co.nz",
        "parentPhone": "0225658925",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Tiffany Norriss",
        "email": "Norrisst@middleton.school.nz",
        "year": null,
        "parentName": "Linda Norriss",
        "parentEmail": "hongnorriss@gmail.com",
        "parentPhone": "0276940108",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    },
    {
        "name": "Anya Flora Wong",
        "email": "wonga2@middleton.school.nz",
        "year": null,
        "parentName": "Flora Tie",
        "parentEmail": "floratie@gmail.com",
        "parentPhone": "021802834",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": true
    },
    {
        "name": "Sloane Ramsay",
        "email": "ramsays@middleton.school.nz",
        "year": null,
        "parentName": "Ruth Ramsay",
        "parentEmail": "kellandruth@ramsay.org.nz",
        "parentPhone": "0211121947",
        "instruments": [
            "Vocals"
        ],
        "status": "active",
        "musicOption": false
    }
];

const LESSONS = [
    {
        "studentKey": "ashton gee|elnsmgee@hotmail.co.nz",
        "studentName": "Ashton Gee",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": true,
        "parentName": "Emma Gee",
        "parentEmail": "elnsmgee@hotmail.co.nz",
        "parentPhone": "272270802",
        "notes": "Experience: Learnt privately for several years however private teacher retiring.\nOther instruments: Guitar lessons with school this year."
    },
    {
        "studentKey": "rocco edwards|summereedwards@gmail.com",
        "studentName": "Rocco Edwards",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": true,
        "parentName": "Summer Edwards",
        "parentEmail": "summereedwards@gmail.com",
        "parentPhone": "0226910197",
        "notes": "Experience: Not much experience"
    },
    {
        "studentKey": "jerrick dhale frasco pia|jeannettefrasco@yahoo.com",
        "studentName": "Jerrick Dhale Frasco Pia",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": true,
        "parentName": "Jeannette Frasco Pia",
        "parentEmail": "jeannettefrasco@yahoo.com",
        "parentPhone": "2041192544",
        "notes": "Experience: Guitar\nOther instruments: Guitar 3 Years- Self Taught and Lessons"
    },
    {
        "studentKey": "hongrui (ray) qiu|gracexue831219@gmail.com",
        "studentName": "Hongrui (Ray) Qiu",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": true,
        "parentName": "Lian Xue",
        "parentEmail": "gracexue831219@gmail.com",
        "parentPhone": "02108374659",
        "notes": "Experience: None\nOther instruments: He has played guitar for more than three years, and he is good strumming."
    },
    {
        "studentKey": "karl shi|yettashi@gmail.com",
        "studentName": "Karl Shi",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": false,
        "parentName": "Yetta Shi",
        "parentEmail": "Yettashi@gmail.com",
        "parentPhone": "0211750364",
        "notes": "Experience: Just started learning for 2 terms.\nOther instruments: Drum. Karl had been learning drum for 7 years."
    },
    {
        "studentKey": "gedeon tseng|henry.christinatseng@gmail.com",
        "studentName": "Gedeon Tseng",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": false,
        "parentName": "Christina Tseng",
        "parentEmail": "henry.christinatseng@gmail.com",
        "parentPhone": "02102492040",
        "notes": "Experience: Beginner's level\nOther instruments: None"
    },
    {
        "studentKey": "matthew jaeger|jaegerfamilynz@gmail.com",
        "studentName": "Matthew Jaeger",
        "tutorName": "Rob Daglish",
        "instrument": "Digital music",
        "funded": true,
        "parentName": "Debbie Jaeger",
        "parentEmail": "jaegerfamilynz@gmail.com",
        "parentPhone": "0272288348",
        "notes": "Experience: 1 year experience"
    },
    {
        "studentKey": "nate birse|lissa@functiongroup.co.nz",
        "studentName": "Nate Birse",
        "tutorName": "Rob Daglish",
        "instrument": "Digital music",
        "funded": false,
        "parentName": "Lissa Birse",
        "parentEmail": "lissa@functiongroup.co.nz",
        "parentPhone": "021973973",
        "notes": "Experience: Has had lessons since Year 9"
    },
    {
        "studentKey": "joshua festing|t.festing@gmail.com",
        "studentName": "Joshua Festing",
        "tutorName": "Rob Daglish",
        "instrument": "Digital music",
        "funded": true,
        "parentName": "Toni Festing",
        "parentEmail": "t.festing@gmail.com",
        "parentPhone": "0275413050",
        "notes": "Experience: No experience in digital music\nOther instruments: He has learnt some keyboard. Not sure of grade."
    },
    {
        "studentKey": "asher wallis|geoff.emma@gmail.com",
        "studentName": "Asher Wallis",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": false,
        "parentName": "Geoff Wallis",
        "parentEmail": "geoff.emma@gmail.com",
        "parentPhone": "0276376355",
        "notes": "Experience: He has been learning bass for 2 years with a private tutor"
    },
    {
        "studentKey": "joshua gerretsen|esteg7@gmail.com",
        "studentName": "Joshua Gerretsen",
        "tutorName": "Rob Daglish",
        "instrument": "Bass",
        "funded": false,
        "parentName": "Este Gerretsen",
        "parentEmail": "esteg7@gmail.com",
        "parentPhone": "021 084 59725",
        "notes": ""
    },
    {
        "studentKey": "katrina melody watts|jacqui_honeypot@hotmail.com",
        "studentName": "Katrina Melody Watts",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": true,
        "parentName": "Jacqueline Watts",
        "parentEmail": "jacqui_honeypot@hotmail.com",
        "parentPhone": "02102717977",
        "notes": "Experience: Katrina started on cello in 2019, but didn't take exams each year. She has just completed Trinity Grade 3 with distinction.\nOther instruments: Katrina has been taking voice lessons at Buller High school. She wishes to continue with singing instruction if possible. In the past she has also learnt drums and beginner piano."
    },
    {
        "studentKey": "blake wilson|joshandcourtneyw@gmail.com",
        "studentName": "Blake Wilson",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": false,
        "parentName": "Courtney Wilson",
        "parentEmail": "joshandcourtneyw@gmail.com",
        "parentPhone": "02102551988",
        "notes": "Experience: Three years with Naomi Harmer\nOther instruments: Four years of Piano, ungraded but plays to a high level"
    },
    {
        "studentKey": "thomas you|fenwang0822@gmail.com",
        "studentName": "Thomas You",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": false,
        "parentName": "Fen Wang",
        "parentEmail": "Fenwang0822@gmail.com",
        "parentPhone": "02108015003",
        "notes": "Experience: I am grade 6 in cello and I have been learning cello for 5 years. I have been learning cello at Middleton for 2 years\nOther instruments: Piano grade 4"
    },
    {
        "studentKey": "sara wong|dkp.wong@gmail.com",
        "studentName": "Sara Wong",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": false,
        "parentName": "David Wong",
        "parentEmail": "dkp.wong@gmail.com",
        "parentPhone": "0272483327",
        "notes": "Experience: No previous experience on Cello, but love the sound of it\nOther instruments: Piano. Doing Grade 1 exam in 2026"
    },
    {
        "studentKey": "tahlia trethowan|jamieetrethowan@live.com",
        "studentName": "Tahlia Trethowan",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": false,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "0275058818",
        "notes": "Experience: Two years previous tuition with Naomi\nOther instruments: Piano grade 4"
    },
    {
        "studentKey": "neeva trethowan|jamieetrethowan@live.com",
        "studentName": "Neeva Trethowan",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": false,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "0275058818",
        "notes": "Experience: Five years previous tuition with Naomi\nOther instruments: Piano, grade 1 level"
    },
    {
        "studentKey": "eden mcgowan|kjmcgowan8 @gmail.com",
        "studentName": "Eden McGowan",
        "tutorName": "Naomi Harmer",
        "instrument": "Cello",
        "funded": false,
        "parentName": "Kirsty McGowan",
        "parentEmail": "kjmcgowan8 @gmail.com",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "sarah wang|wangna.chch@gmail.com",
        "studentName": "Sarah Wang",
        "tutorName": "Lana Law",
        "instrument": "Saxophone",
        "funded": true,
        "parentName": "Na Wang",
        "parentEmail": "wangna.chch@gmail.com",
        "parentPhone": "021880563",
        "notes": "Experience: 2025 Jazz band, saxophone grade 3\nOther instruments: Piano"
    },
    {
        "studentKey": "jayden wang|elsahubo6@gmail.com",
        "studentName": "Jayden Wang",
        "tutorName": "Lana Law",
        "instrument": "Saxophone",
        "funded": true,
        "parentName": "Bo Hu",
        "parentEmail": "elsahubo6@gmail.com",
        "parentPhone": "0226905217",
        "notes": "Experience: Piano grade 5\nOther instruments: Piano Grade 5"
    },
    {
        "studentKey": "raphael lau|rebeccamonki@gmail.com",
        "studentName": "Raphael Lau",
        "tutorName": "Lana Law",
        "instrument": "Clarinet",
        "funded": false,
        "parentName": "Rebecca Leung",
        "parentEmail": "rebeccamonki@gmail.com",
        "parentPhone": "02102784424",
        "notes": "Experience: Raphael has been learning clarinet from Lana Law at the school in the past years, he passed his Grade 3 exam this year.\nOther instruments: Piano - Grade 3-4"
    },
    {
        "studentKey": "grace prince|maureenprince7@gmail.com",
        "studentName": "Grace Prince",
        "tutorName": "Lana Law",
        "instrument": "Saxophone",
        "funded": false,
        "parentName": "Maureen Prince",
        "parentEmail": "Maureenprince7@gmail.com",
        "parentPhone": "0211543884",
        "notes": "Experience: Year 7-11 lessons\nOther instruments: Na"
    },
    {
        "studentKey": "gabrielle hsu|suisiu@yahoo.com",
        "studentName": "Gabrielle Hsu",
        "tutorName": "Lana Law",
        "instrument": "Saxophone",
        "funded": true,
        "parentName": "Angela Hsu",
        "parentEmail": "suisiu@yahoo.com",
        "parentPhone": "021688793",
        "notes": "Experience: none\nOther instruments: Piano Grade 8 and Viola Grade 5"
    },
    {
        "studentKey": "kiah ashwell|super.bluff@hotmail.com",
        "studentName": "Kiah Ashwell",
        "tutorName": "Lana Law",
        "instrument": "Clarinet",
        "funded": true,
        "parentName": "Bethany Ashwell",
        "parentEmail": "super.bluff@hotmail.com",
        "parentPhone": "0276306473",
        "notes": "Experience: None\nOther instruments: Bass Beginner, Piano Grade 4 ABSRM, Guitar Advanced, Drums beginner."
    },
    {
        "studentKey": "liam young|markandgina@gmail.com",
        "studentName": "Liam Young",
        "tutorName": "Lana Law",
        "instrument": "Saxophone",
        "funded": true,
        "parentName": "Gina Young",
        "parentEmail": "markandgina@gmail.com",
        "parentPhone": "0212940947",
        "notes": "Experience: Liam is newish to saxophone\nOther instruments: piano - grade eight level, french horn - one year's experience"
    },
    {
        "studentKey": "sakura ishii|nobutiny@icloud.com",
        "studentName": "Sakura Ishii",
        "tutorName": "Lana Law",
        "instrument": "Saxophone",
        "funded": true,
        "parentName": "Nobuko Ishii",
        "parentEmail": "nobutiny@icloud.com",
        "parentPhone": "02902269914",
        "notes": "Experience: She learned the saxophone for a year last year and joined jazz band practice as well."
    },
    {
        "studentKey": "ran ishii|nobutiny@icloud.com",
        "studentName": "Ran Ishii",
        "tutorName": "Lana Law",
        "instrument": "Clarinet",
        "funded": true,
        "parentName": "Nobuko Ishii",
        "parentEmail": "nobutiny@icloud.com",
        "parentPhone": "02902269914",
        "notes": "Experience: She has one year of experience playing the clarinet."
    },
    {
        "studentKey": "aiden son|hyun7022328@gmail.com",
        "studentName": "Aiden Son",
        "tutorName": "Lana Law",
        "instrument": "Clarinet",
        "funded": false,
        "parentName": "Seunghyun Lee",
        "parentEmail": "hyun7022328@gmail.com",
        "parentPhone": "0211465191",
        "notes": ""
    },
    {
        "studentKey": "nathaniel yip|alexcandy.yip@gmail.com",
        "studentName": "Nathaniel Yip",
        "tutorName": "Lana Law",
        "instrument": "Clarinet",
        "funded": false,
        "parentName": "Candy Lin",
        "parentEmail": "alexcandy.yip@gmail.com",
        "parentPhone": "0221090873",
        "notes": ""
    },
    {
        "studentKey": "cody ballinger|frostette2@hotmail.com",
        "studentName": "Cody Ballinger",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Gemma Ballinger",
        "parentEmail": "frostette2@hotmail.com",
        "parentPhone": "021 157 5274",
        "notes": "Experience: 5 years"
    },
    {
        "studentKey": "samuel pellow|r.c.pellow@xtra.co.nz",
        "studentName": "Samuel Pellow",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Catherine Pellow",
        "parentEmail": "r.c.pellow@xtra.co.nz",
        "parentPhone": "0211054005",
        "notes": "Experience: Samuel has been learning drums with Cameron for 6 years\nOther instruments: No"
    },
    {
        "studentKey": "samuel mattingley|naiomi.mattingley@gmail.com",
        "studentName": "Samuel Mattingley",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "notes": "Experience: Been learning with Cameron for 3 years\nOther instruments: Piano, Grade 3"
    },
    {
        "studentKey": "hyunu lee|hoyoungandlauren@gmail.com",
        "studentName": "Hyunu Lee",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Hoyoung and Lorne Lee",
        "parentEmail": "hoyoungandlauren@gmail.com",
        "parentPhone": "0275187328",
        "notes": "Experience: N/A\nOther instruments: N/A"
    },
    {
        "studentKey": "bianka yang|sgsuli@hotmail.com",
        "studentName": "Bianka Yang",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Suli",
        "parentEmail": "Sgsuli@hotmail.com",
        "parentPhone": "0212699965",
        "notes": "Experience: None\nOther instruments: Piano Grade 7 and Guitar 2 years"
    },
    {
        "studentKey": "vincent campbell|tiffa@hotmail.co.nz",
        "studentName": "Vincent campbell",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Tiffany marshall",
        "parentEmail": "Tiffa@hotmail.co.nz",
        "parentPhone": "0211738495",
        "notes": "Experience: Beginner"
    },
    {
        "studentKey": "isaac moe|we3moes@me.com",
        "studentName": "Isaac Moe",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "notes": "Experience: Isaac has been learning for 2 years"
    },
    {
        "studentKey": "jayden alec cortez|jaydenalex81@yahoo.com",
        "studentName": "Jayden Alec Cortez",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Jocelyn Cortez",
        "parentEmail": "Jaydenalex81@yahoo.com",
        "parentPhone": "0211480723",
        "notes": "Experience: Average"
    },
    {
        "studentKey": "zechariah si|miniko1943@gmail.com",
        "studentName": "Zechariah Si",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Liena Si",
        "parentEmail": "miniko1943@gmail.com",
        "parentPhone": "0212161001",
        "notes": "Experience: Beginner\nOther instruments: Piano"
    },
    {
        "studentKey": "jayden watson|bridgetmail@me.com",
        "studentName": "Jayden Watson",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Bridget Watson",
        "parentEmail": "Bridgetmail@me.com",
        "parentPhone": "0211097110",
        "notes": "Experience: Part of a Marimba group in year 5"
    },
    {
        "studentKey": "ellie mae jaquiery|nathandcarrie@yahoo.com",
        "studentName": "Ellie Mae Jaquiery",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Nathan Jaquiery",
        "parentEmail": "nathandcarrie@yahoo.com",
        "parentPhone": "0276283663",
        "notes": "Experience: n/a previous experience\nOther instruments: n/a"
    },
    {
        "studentKey": "ella-rose mcconnell|sjmcconnell4@gmail.com",
        "studentName": "Ella-Rose McConnell",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Jacqui McConnell",
        "parentEmail": "sjmcconnell4@gmail.com",
        "parentPhone": "0224236087",
        "notes": "Experience: 7 years"
    },
    {
        "studentKey": "jimmy minty|emily@mintdevelopments.co.nz",
        "studentName": "Jimmy Minty",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Emily Minty",
        "parentEmail": "Emily@mintdevelopments.co.nz",
        "parentPhone": "021 810 702",
        "notes": "Experience: None but in think he might have good rythem\nOther instruments: No"
    },
    {
        "studentKey": "nathan parker|matt.lesley.parker@gmail.com",
        "studentName": "Nathan Parker",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Matthew Parker",
        "parentEmail": "matt.lesley.parker@gmail.com",
        "parentPhone": "02102279664",
        "notes": "Experience: .\nOther instruments: ."
    },
    {
        "studentKey": "ethan highsted|jo.highsted@gmail.com",
        "studentName": "Ethan Highsted",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Jo Highsted",
        "parentEmail": "jo.highsted@gmail.com",
        "parentPhone": "02102742245",
        "notes": "Experience: Ethan has been playing drums for several years. He is an experienced drummer and had itinerant drum lessons at school this year.\nOther instruments: Guitar, Piano"
    },
    {
        "studentKey": "austin fletcher|dawnjean@gmail.com",
        "studentName": "Austin Fletcher",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Dawn Fletcher",
        "parentEmail": "dawnjean@gmail.com",
        "parentPhone": "021 254 5916",
        "notes": "Experience: Austin is currently taking Drum lessons within school with Cameron."
    },
    {
        "studentKey": "william breeze|faith.jeremiah@hotmail.com",
        "studentName": "William Breeze",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Faith Jeremiah",
        "parentEmail": "faith.jeremiah@hotmail.com",
        "parentPhone": "0210592300",
        "notes": "Experience: no"
    },
    {
        "studentKey": "avion samuels|wilfred.samuels@hotmail.com",
        "studentName": "Avion Samuels",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Wilfred Samuels",
        "parentEmail": "wilfred.samuels@hotmail.com",
        "parentPhone": "0220129047",
        "notes": "Experience: Outside school Avion had both drumming and guitar lessons. He also have his own guitar and drumset at home for practice.\nOther instruments: Guitar"
    },
    {
        "studentKey": "joshua ferguson|thefergclan@hotmail.com",
        "studentName": "Joshua Ferguson",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Jeremy Ferguson",
        "parentEmail": "thefergclan@hotmail.com",
        "parentPhone": "021888751",
        "notes": "Experience: Many Years Drums\nOther instruments: Joshua wants to do the Drums again and add in Guitar as a beginner"
    },
    {
        "studentKey": "jake van tonder|nvantonder76@gmail.com",
        "studentName": "Jake van Tonder",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Nanda Van Tonder",
        "parentEmail": "Nvantonder76@gmail.com",
        "parentPhone": "0211703974",
        "notes": "Experience: None\nOther instruments: None"
    },
    {
        "studentKey": "austen pope|roland.pope@gmail.com",
        "studentName": "Austen Pope",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Roland Pope",
        "parentEmail": "roland.pope@gmail.com",
        "parentPhone": "0272462036",
        "notes": "Experience: Limited self guided practice on a kit at home\nOther instruments: He has done basic guitar lessons privately in previous years"
    },
    {
        "studentKey": "paige churton|kimchurton@yahoo.co.nz",
        "studentName": "Paige Churton",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Kim Churton",
        "parentEmail": "kimchurton@yahoo.co.nz",
        "parentPhone": "0211168138",
        "notes": "Experience: Paige has been learning drums for two terms - both at school and with an external teacher"
    },
    {
        "studentKey": "matthew jaeger|jaegerfamilynz@gmail.com",
        "studentName": "Matthew Jaeger",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Debbie Jaeger",
        "parentEmail": "jaegerfamilynz@gmail.com",
        "parentPhone": "0272288348",
        "notes": "Experience: 5 years"
    },
    {
        "studentKey": "samuel chyn an wong|dkp.wong@gmail.com",
        "studentName": "Samuel Chyn An Wong",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "David King Poh Wong",
        "parentEmail": "dkp.wong@gmail.com",
        "parentPhone": "0272483327",
        "notes": "Experience: No experience in Drums, but pick this as my secound instrument\nOther instruments: Piano, taking grade 8 exam in 2026"
    },
    {
        "studentKey": "oliver pomare|thepomares@gmail.com",
        "studentName": "Oliver pomare",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Jo Pomare",
        "parentEmail": "thepomares@gmail.com",
        "parentPhone": "0272033051",
        "notes": "Experience: Ollie has been playing the drums for nearly 4 years"
    },
    {
        "studentKey": "reuben ure|timandkirst@yahoo.co.nz",
        "studentName": "Reuben ure",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Kirsty ure",
        "parentEmail": "Timandkirst@yahoo.co.nz",
        "parentPhone": "0223095269",
        "notes": "Experience: Played since year 1"
    },
    {
        "studentKey": "ryan chan|jc.chan08@gmail.com",
        "studentName": "Ryan Chan",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Charleen Chan",
        "parentEmail": "jc.chan08@gmail.com",
        "parentPhone": "021442172",
        "notes": "Experience: Yes\nOther instruments: No"
    },
    {
        "studentKey": "thane walker|walker.christchurch@gmail.com",
        "studentName": "Thane Walker",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Brittany Walker",
        "parentEmail": "walker.christchurch@gmail.com",
        "parentPhone": "0274690650",
        "notes": "Experience: Thane started lessons in 2024"
    },
    {
        "studentKey": "ethan chan|jc.chan08@gmail.com",
        "studentName": "Ethan Chan",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Charleen Chan",
        "parentEmail": "jc.chan08@gmail.com",
        "parentPhone": "021442172",
        "notes": "Experience: Similar to Ryan Chan I think\nOther instruments: No"
    },
    {
        "studentKey": "lucas qiao|michael_qcs@hotmail.com",
        "studentName": "Lucas Qiao",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Ying Qiu",
        "parentEmail": "michael_qcs@hotmail.com",
        "parentPhone": "0211670957",
        "notes": "Experience: Learn 1 year"
    },
    {
        "studentKey": "theo kench|ameliakench@gmail.com",
        "studentName": "Theo Kench",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Amelia Kench",
        "parentEmail": "ameliakench@gmail.com",
        "parentPhone": "0273051633",
        "notes": "Experience: No experience"
    },
    {
        "studentKey": "henry scoulding|simon.scoulding@gmail.com",
        "studentName": "Henry Scoulding",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Alice Scoulding",
        "parentEmail": "simon.scoulding@gmail.com",
        "parentPhone": "0226589739",
        "notes": "Experience: Already working with you."
    },
    {
        "studentKey": "flynn atkinson|mellyc999@gmail.com",
        "studentName": "Flynn Atkinson",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Melanie Atkinson",
        "parentEmail": "mellyc999@gmail.com",
        "parentPhone": "0274692226",
        "notes": "Experience: Been doing drum lessons in year 9 and enjoying it. Would like to continue."
    },
    {
        "studentKey": "karl shi|yettashi@gmail.com",
        "studentName": "Karl Shi",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Yetta Song",
        "parentEmail": "Yettashi@gmail.com",
        "parentPhone": "0211759364",
        "notes": "Experience: Karl has been learning drum at Middleton wi th Cameron for 7years.\nOther instruments: Bass, just started learning, no grade achieved so far."
    },
    {
        "studentKey": "israel couperus|ljcouperus@gmail.com",
        "studentName": "Israel Couperus",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Joanna Couperus",
        "parentEmail": "ljcouperus@gmail.com",
        "parentPhone": "0274503833",
        "notes": "Experience: Been learning at school for the past four years"
    },
    {
        "studentKey": "nikhil lal|sonyanesh@yahoo.com",
        "studentName": "Nikhil Lal",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Sonya Lal",
        "parentEmail": "Sonyanesh@yahoo.com",
        "parentPhone": "0211410791",
        "notes": "Experience: Current student"
    },
    {
        "studentKey": "aiden john reynolds|richard.reynolds@hamiltonjet.nz",
        "studentName": "Aiden John Reynolds",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Richard Reynolds",
        "parentEmail": "richard.reynolds@hamiltonjet.nz",
        "parentPhone": "022 658 1542",
        "notes": "Experience: Has been taking drums with Cameron through MGS for year 9 and 10"
    },
    {
        "studentKey": "raymond im|yangcellina78@naver.com",
        "studentName": "Raymond Im",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Cellina Yang",
        "parentEmail": "yangcellina78@naver.com",
        "parentPhone": "0274270730",
        "notes": "Experience: Played in different bands\nOther instruments: Guitar"
    },
    {
        "studentKey": "rosemary gerretsen|esteg7@gmail.com",
        "studentName": "Rosemary Gerretsen",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Este Gerretsen",
        "parentEmail": "Esteg7@gmail.com",
        "parentPhone": "021 08459725",
        "notes": "Experience: Rosie is currently doing drums with Cameron\nOther instruments: Drums"
    },
    {
        "studentKey": "luke baker|bakerfam2007@gmail.com",
        "studentName": "Luke Baker",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Brigit Baker",
        "parentEmail": "bakerfam2007@gmail.com",
        "parentPhone": "0274339504",
        "notes": "Experience: Luke has learned drums through Monster Music since 2022."
    },
    {
        "studentKey": "levi wallis|geoff.emma@gmail.com",
        "studentName": "Levi Wallis",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Emma Wallis",
        "parentEmail": "geoff.emma@gmail.com",
        "parentPhone": "0274644545",
        "notes": "Experience: Currently getting lessons from Cameron"
    },
    {
        "studentKey": "ethan clancey|liesl.clancey@gmail.com",
        "studentName": "Ethan Clancey",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Liesl Clancey",
        "parentEmail": "liesl.clancey@gmail.com",
        "parentPhone": "0276221512",
        "notes": "Experience: no previous drum experience\nOther instruments: Ethan has been learning piano for 2 years at school.  It has helped him develop his rhythm and he is very keen to give drums a go"
    },
    {
        "studentKey": "sam clancey|liesl.clancey@gmail.com",
        "studentName": "Sam Clancey",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Liesl Clancey",
        "parentEmail": "liesl.clancey@gmail.com",
        "parentPhone": "0276221512",
        "notes": "Experience: No previous experience, he will be a beginner."
    },
    {
        "studentKey": "joseph kuo|muhsinhsu@gmail.com",
        "studentName": "Joseph Kuo",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Grace Hsu",
        "parentEmail": "muhsinhsu@gmail.com",
        "parentPhone": "021523664",
        "notes": "Experience: Joseph has had three 30min long private lessons before.\nOther instruments: Joseph has learned piano for 2.5 years now. Preparing for the 1st grade exam."
    },
    {
        "studentKey": "micah atkinson|mellyc999@gmail.com",
        "studentName": "Micah Atkinson",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Melanie Atkinso",
        "parentEmail": "mellyc999@gmail.com",
        "parentPhone": "0274692226",
        "notes": "Experience: No formal experience but ww have a drum set at home and he has some talent there."
    },
    {
        "studentKey": "jedidiah igot|edilenson@gmail.com",
        "studentName": "Jedidiah Igot",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Edilenson Igot",
        "parentEmail": "Edilenson@gmail.com",
        "parentPhone": "0275120698",
        "notes": "Experience: No experience in playing drums\nOther instruments: Iah plays violin, piano, guitar, and bass."
    },
    {
        "studentKey": "zara tse|peggytsui@gmail.com",
        "studentName": "Zara Tse",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Peggy Tsui",
        "parentEmail": "Peggytsui@gmail.com",
        "parentPhone": "852 90513963",
        "notes": "Experience: No experience at all\nOther instruments: Violin"
    },
    {
        "studentKey": "jayden cortez|jaydenalex81@yahoo.com",
        "studentName": "Jayden Cortez",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Jocelyn Cortez",
        "parentEmail": "Jaydenalex81@yahoo.com",
        "parentPhone": "0211480723",
        "notes": "Experience: He missed last year as full already"
    },
    {
        "studentKey": "jonathan lim|emmelin.lee@gmail.com",
        "studentName": "Jonathan Lim",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Emmelin Lee",
        "parentEmail": "emmelin.lee@gmail.com",
        "parentPhone": "021 939633",
        "notes": "Experience: Has been learning drums with an itinerant teacher at Aidanfield Christian School for the past few years\nOther instruments: Jonathan has also picked up the guitar recently, playing occasionally for home group."
    },
    {
        "studentKey": "steve lee|hyun54385432@gmail.com",
        "studentName": "Steve Lee",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Christina Lee",
        "parentEmail": "hyun54385432@gmail.com",
        "parentPhone": "0275792474",
        "notes": "Experience: more than 5years"
    },
    {
        "studentKey": "oliver owen|gjo@hotmail.co.nz",
        "studentName": "Oliver Owen",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "gareth owen",
        "parentEmail": "gjo@hotmail.co.nz",
        "parentPhone": "021755062",
        "notes": "Experience: 1 year\nOther instruments: guitar and bass"
    },
    {
        "studentKey": "asher thomas drake|andrew@drake.nz",
        "studentName": "Asher Thomas Drake",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Andrew Drake",
        "parentEmail": "Andrew@drake.nz",
        "parentPhone": "0212567653",
        "notes": "Experience: Played for a couple of years with Cameron\nOther instruments: Ilam"
    },
    {
        "studentKey": "aiden reynolds|treynoldsrn@gmail.com",
        "studentName": "Aiden Reynolds",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Tana Reynolds",
        "parentEmail": "Treynoldsrn@gmail.com",
        "parentPhone": "0226579492",
        "notes": "Experience: Last 5 years\nOther instruments: Guitar"
    },
    {
        "studentKey": "roy park|bluezone1999@hanmail.net",
        "studentName": "Roy Park",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "April Kim",
        "parentEmail": "bluezone1999@hanmail.net",
        "parentPhone": "02102263880",
        "notes": "Experience: 2years"
    },
    {
        "studentKey": "nathan abin jose|elsa.pretty@gmail.com",
        "studentName": "Nathan Abin Jose",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": false,
        "parentName": "Pretty Sam",
        "parentEmail": "Elsa.pretty@gmail.com",
        "parentPhone": "022 155 9551",
        "notes": "Experience: Has been learning drums for the last 3 years"
    },
    {
        "studentKey": "daniel esterhuizen|angelique_esterhuizen@yahoo.com",
        "studentName": "Daniel Esterhuizen",
        "tutorName": "Cameron Finlay",
        "instrument": "Drums",
        "funded": true,
        "parentName": "Angelique Esterhuizen",
        "parentEmail": "angelique_esterhuizen@yahoo.com",
        "parentPhone": "02041338637",
        "notes": "Experience: Daniel has been taking drum lessons with Cameron Finlay at school for the past two years.\nOther instruments: Piano - Suzuki teaching method. No grade asyet."
    },
    {
        "studentKey": "therese surrey|surreyfamily2006@gmail.com",
        "studentName": "Therese Surrey",
        "tutorName": "Susan Dollin",
        "instrument": "Flute",
        "funded": true,
        "parentName": "Vicki Surrey",
        "parentEmail": "surreyfamily2006@gmail.com",
        "parentPhone": "0272442152",
        "notes": "Experience: Therese has been learning flute for 4 years from Susan."
    },
    {
        "studentKey": "lime park|bluezone1999@hanmail.net",
        "studentName": "Lime Park",
        "tutorName": "Susan Dollin",
        "instrument": "Flute",
        "funded": true,
        "parentName": "April Kim",
        "parentEmail": "bluezone1999@hanmail.net",
        "parentPhone": "02102263880",
        "notes": "Experience: Just 2months\nOther instruments: Violin grade 3 level,piano grade 3 level"
    },
    {
        "studentKey": "ricky wu|lukewu19850816@gmail.com",
        "studentName": "Ricky Wu",
        "tutorName": "Susan Dollin",
        "instrument": "Flute",
        "funded": false,
        "parentName": "Can Wang",
        "parentEmail": "lukewu19850816@gmail.com",
        "parentPhone": "0275771874",
        "notes": "Experience: 5 Years Experience Currently at grade 4 setting grade 6\nOther instruments: Guitar no grades currently"
    },
    {
        "studentKey": "aine sugiyama|excelnz.haruna@gmail.com",
        "studentName": "Aine Sugiyama",
        "tutorName": "Susan Dollin",
        "instrument": "Flute",
        "funded": true,
        "parentName": "Haruna Murakami",
        "parentEmail": "excelnz.haruna@gmail.com",
        "parentPhone": "02041295986",
        "notes": "Experience: 1 year\nOther instruments: Piano (6 years)"
    },
    {
        "studentKey": "annabelle venter|venterphia@gmail.com",
        "studentName": "Annabelle Venter",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Phia Venter",
        "parentEmail": "Venterphia@gmail.com",
        "parentPhone": "0210475451",
        "notes": "Experience: Year 9 Music\nOther instruments: Ukele"
    },
    {
        "studentKey": "matthew hentschel|bridey75@outlook.co.nz",
        "studentName": "Matthew Hentschel",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Bridey Hentschel",
        "parentEmail": "bridey75@outlook.co.nz",
        "parentPhone": "0212564637",
        "notes": "Experience: He has been learning with Motoi for the last 3 years"
    },
    {
        "studentKey": "karston davie|brent.neeley.davie@gmail.com",
        "studentName": "Karston Davie",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Neeley Davie",
        "parentEmail": "brent.neeley.davie@gmail.com",
        "parentPhone": "0272477611",
        "notes": "Experience: Playing guitar 6-7 years plays acoustic and electric\nOther instruments: Piano and voice/singing, would be interested in funded lessons for those."
    },
    {
        "studentKey": "aida-mae auld|lauracauld@gmail.com",
        "studentName": "Aida-Mae Auld",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Laura Auld",
        "parentEmail": "lauracauld@gmail.com",
        "parentPhone": "0211594373",
        "notes": "Experience: Has had one and half years of lessons outside of school\nOther instruments: Voice"
    },
    {
        "studentKey": "travis ballinger|frostette2@hotmail.com",
        "studentName": "Travis Ballinger",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Gemma Ballinger",
        "parentEmail": "frostette2@hotmail.com",
        "parentPhone": "0211575274",
        "notes": "Experience: 5 years"
    },
    {
        "studentKey": "tom robson|grobson23@gmail.com",
        "studentName": "Tom Robson",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Geoff Robson",
        "parentEmail": "grobson23@gmail.com",
        "parentPhone": "0212522955",
        "notes": "Experience: Tom has been learning guitar since 2022, and had lessons with Motoi in 2025.\nOther instruments: Tom has been playing drums since 2015. He's also keen to learn other instruments in the coming years."
    },
    {
        "studentKey": "joshua john scarrott|tracey_scarrott1970@live.com",
        "studentName": "Joshua John Scarrott",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Tracy Scarrott",
        "parentEmail": "tracey_scarrott1970@live.com",
        "parentPhone": "0278660044",
        "notes": "Experience: None\nOther instruments: None"
    },
    {
        "studentKey": "micah davis|daviskelly12@gmail.com",
        "studentName": "Micah Davis",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Kelly Davis",
        "parentEmail": "daviskelly12@gmail.com",
        "parentPhone": "0211541256",
        "notes": "Experience: Played in 2025"
    },
    {
        "studentKey": "pedro pellizzari|andholl@gmail.com",
        "studentName": "Pedro Pellizzari",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Andrea Hollmann",
        "parentEmail": "andholl@gmail.com",
        "parentPhone": "0212637708",
        "notes": "Experience: Took lessons this year with Motoi"
    },
    {
        "studentKey": "chanho jeon|drem8001@gmail.com",
        "studentName": "Chanho Jeon",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "EunHyeLym",
        "parentEmail": "drem8001@gmail.com",
        "parentPhone": "0211398337",
        "notes": "Experience: Learn at school for one year in the year 7\nOther instruments: Piano/ Grade 3"
    },
    {
        "studentKey": "ritsuki kawai|maiko_can@yahoo.co.jp",
        "studentName": "Ritsuki Kawai",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Maiko Kawai",
        "parentEmail": "maiko_can@yahoo.co.jp",
        "parentPhone": "02108649260",
        "notes": "Experience: He started learning guitar at the age of 10 and took private lessons for the first year. He now plays every week in the church worship team. I'm not sure about his current grade.\nOther instruments: He is also interested in piano and plays it on his own."
    },
    {
        "studentKey": "sienna ellena|timandruthellena@gmail.com",
        "studentName": "Sienna Ellena",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Ruth Ellena",
        "parentEmail": "Timandruthellena@gmail.com",
        "parentPhone": "0276544999",
        "notes": "Experience: None. I have emailed Motoi and he has Siennas name down."
    },
    {
        "studentKey": "lucy penno|joy.penno65@gmail.com",
        "studentName": "Lucy Penno",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Joy Penno",
        "parentEmail": "joy.penno65@gmail.com",
        "parentPhone": "0221368326",
        "notes": "Experience: Vocals"
    },
    {
        "studentKey": "bianka yang|sgsuli@hotmail.com",
        "studentName": "Bianka Yang",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Suli",
        "parentEmail": "Sgsuli@hotmail.com",
        "parentPhone": "0212699965",
        "notes": "Experience: 2 yrs\nOther instruments: Piano Grade 7"
    },
    {
        "studentKey": "ezra edwards|summereedwards@gmail.com",
        "studentName": "Ezra Edwards",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Summer Edwards",
        "parentEmail": "summereedwards@gmail.com",
        "parentPhone": "0226910197",
        "notes": "Experience: Had lessons at school from year 9 onwards"
    },
    {
        "studentKey": "rintaro yamashita|excelnz.haruna@gmail.com",
        "studentName": "Rintaro YAMASHITA",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Haruna Murakami",
        "parentEmail": "excelnz.haruna@gmail.com",
        "parentPhone": "02041295986",
        "notes": "Experience: 1.5 years\nOther instruments: Bass (5 years), Piano (Beginner)"
    },
    {
        "studentKey": "sol armstrong|elisearm@gmail.com",
        "studentName": "Sol Armstrong",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Elise Armstrong",
        "parentEmail": "elisearm@gmail.com",
        "parentPhone": "0211485400",
        "notes": "Experience: Guitar lessons with Motoi since yr 7"
    },
    {
        "studentKey": "blake ramsay|kellandruth@ramsay.org.nz",
        "studentName": "Blake Ramsay",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Ruth Ramsay",
        "parentEmail": "kellandruth@ramsay.org.nz",
        "parentPhone": "0211121947",
        "notes": "Experience: Lessons with Motoi for the last 2 yrs"
    },
    {
        "studentKey": "valeria galaz|yareni.duarte@gmail.com",
        "studentName": "Valeria Galaz",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Yareni Duarte",
        "parentEmail": "yareni.duarte@gmail.com",
        "parentPhone": "0211594146",
        "notes": "Experience: guitar\nOther instruments: Flute"
    },
    {
        "studentKey": "hanalei siose|utahlicious@msn.com",
        "studentName": "Hanalei Siose",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Uta Siose",
        "parentEmail": "utahlicious@msn.com",
        "parentPhone": "0212644088",
        "notes": "Experience: Hanalei would like to continue with guitar lessons as she's been taking lessons since year 7.\nOther instruments: N/a"
    },
    {
        "studentKey": "bella wong|bravtrust@gmail.com",
        "studentName": "Bella Wong",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Vicky Ma",
        "parentEmail": "Bravtrust@gmail.com",
        "parentPhone": "0212288522",
        "notes": "Experience: No previous experience in playing guitar\nOther instruments: NA"
    },
    {
        "studentKey": "ethan mcconnell|sjmcconnell4@gmail.com",
        "studentName": "Ethan McConnell",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Jacqui McConnell",
        "parentEmail": "sjmcconnell4@gmail.com",
        "parentPhone": "0224236087",
        "notes": "Experience: None\nOther instruments: Grade 8 piano"
    },
    {
        "studentKey": "taj armstrong|elisearm@gmail.com",
        "studentName": "Taj Armstrong",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Elise Armstrong",
        "parentEmail": "elisearm@gmail.com",
        "parentPhone": "0211485400",
        "notes": "Experience: year 7 lessons with Motoi"
    },
    {
        "studentKey": "joshua ferguson|thefergclan@hotmail.com",
        "studentName": "Joshua ferguson",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Jeremy Ferguson",
        "parentEmail": "thefergclan@hotmail.com",
        "parentPhone": "021888751",
        "notes": "Experience: Many years experience on Drums\nOther instruments: Multiple Years on Drums. Joshua would like to continue with the Drums and add in Guitar next year as a beginner."
    },
    {
        "studentKey": "evie brown|lizzy.sisson@gmail.com",
        "studentName": "Evie Brown",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Lizzy Brown",
        "parentEmail": "lizzy.sisson@gmail.com",
        "parentPhone": "0212439445",
        "notes": "Experience: Year 6 lessons with Mrs Rudd, Year 7 and 8 lessons with Motoi\nOther instruments: None"
    },
    {
        "studentKey": "luke churton|kimchurton@yahoo.co.nz",
        "studentName": "Luke Churton",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Kim Churton",
        "parentEmail": "kimchurton@yahoo.co.nz",
        "parentPhone": "0211168138",
        "notes": "Experience: Luke has been learning the guitar for around 18 months - both at school and with an external tutor"
    },
    {
        "studentKey": "james carpenter|bradandfleur@gmail.com",
        "studentName": "James Carpenter",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Fleur Carpenter",
        "parentEmail": "bradandfleur@gmail.com",
        "parentPhone": "0277052308",
        "notes": "Experience: Nil"
    },
    {
        "studentKey": "naomi roberts|marionelephant@gmail.com",
        "studentName": "Naomi Roberts",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Marion Roberts",
        "parentEmail": "marionelephant@gmail.com",
        "parentPhone": "0211869398",
        "notes": "Experience: Self taught for 2 years, no exams (2 paid lessons over this time)\nOther instruments: Keyboard for four years at primary school, no exams, ukulele for half a year, no exams"
    },
    {
        "studentKey": "sam ure|timandkirst@yahoo.co.nz",
        "studentName": "Sam ure",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Kirsty ure",
        "parentEmail": "Timandkirst@yahoo.co.nz",
        "parentPhone": "0223095269",
        "notes": "Experience: Played since year 2"
    },
    {
        "studentKey": "monty given|andygiven2@gmail.com",
        "studentName": "Monty Given",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Andy and Suz Given",
        "parentEmail": "andygiven2@gmail.com",
        "parentPhone": "021 0625164",
        "notes": "Experience: 1 1/4 years of lessons at MGS\nOther instruments: Voice - involved in MGS productions since Year 7"
    },
    {
        "studentKey": "lillie birse|lissa@functiongroup.co.nz",
        "studentName": "Lillie Birse",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Lissa Birse",
        "parentEmail": "lissa@functiongroup.co.nz",
        "parentPhone": "021973973",
        "notes": "Experience: Nil"
    },
    {
        "studentKey": "grace holah|timmy.holah@grace.org.nz",
        "studentName": "Grace Holah",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Timmy Holah",
        "parentEmail": "timmy.holah@grace.org.nz",
        "parentPhone": "0273071555",
        "notes": "Experience: No previous experience\nOther instruments: No"
    },
    {
        "studentKey": "vincent campbell|tiffa@hotmail.co.nz",
        "studentName": "Vincent campbell",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Tiffany Marshall",
        "parentEmail": "Tiffa@hotmail.co.nz",
        "parentPhone": "0211738495",
        "notes": "Experience: 0"
    },
    {
        "studentKey": "aiden john reynolds|richard.reynolds@hamiltonjet.nz",
        "studentName": "Aiden John Reynolds",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Richard Reynolds",
        "parentEmail": "richard.reynolds@hamiltonjet.nz",
        "parentPhone": "0226581542",
        "notes": "Experience: Currently taking drum lessons, completed year 9 and 10 Music at MGS.\nOther instruments: drums - quite good"
    },
    {
        "studentKey": "adelia orr|dankatorr@gmail.com",
        "studentName": "Adelia Orr",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Katherine Orr",
        "parentEmail": "dankatorr@gmail.com",
        "parentPhone": "0273748137",
        "notes": "Experience: Self-taught, but capable of picking up songs from the radio by ear. Can do a bit of fingerpicking, but keen to improve in this area.\nOther instruments: Vocal - 3 years of singing lessons with Mrs MacFarlane"
    },
    {
        "studentKey": "maddie wallis|geoff.emma@gmail.com",
        "studentName": "Maddie Wallis",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Emma Wallis",
        "parentEmail": "geoff.emma@gmail.com",
        "parentPhone": "0274644545",
        "notes": "Experience: Maddie is currently getting lessons from Motoi\nOther instruments: Maddie has voice lessons from Mellow studios"
    },
    {
        "studentKey": "isaac cooper|heatherbulman@hotmail.com",
        "studentName": "Isaac Cooper",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Heather Cooper",
        "parentEmail": "heatherbulman@hotmail.com",
        "parentPhone": "0221768514",
        "notes": "Experience: Isaac has had guitar lessons since Year 3 up until the end of Year 7. We had to pause lessons this year due to finances. He is a very proficient acoustic guitar player as well as singer."
    },
    {
        "studentKey": "aaron festing|t.festing@gmail.com",
        "studentName": "Aaron Festing",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Toni Festing",
        "parentEmail": "t.festing@gmail.com",
        "parentPhone": "0275413050",
        "notes": "Experience: Aaron has been learning through Monster Music. He's progressed to grade 5 over 2 years."
    },
    {
        "studentKey": "aspen alessandra barr|salvebanatao@yahoo.com",
        "studentName": "Aspen Alessandra Barr",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Maria & Maverick Barr",
        "parentEmail": "salvebanatao@yahoo.com",
        "parentPhone": "02102282470",
        "notes": "Experience: She's been having guitar lessons (funded) since year 9 with Mr. Motoi Shibusawa.\nOther instruments: N/A"
    },
    {
        "studentKey": "olive hope|hope.jessicamarie@gmail.com",
        "studentName": "Olive Hope",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Jessica Hope",
        "parentEmail": "hope.jessicamarie@gmail.com",
        "parentPhone": "02102482313",
        "notes": "Experience: None"
    },
    {
        "studentKey": "anastasia hardanava|vhardanava@icloud.com",
        "studentName": "Anastasia Hardanava",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Veronica  Hardanava",
        "parentEmail": "Vhardanava@icloud.com",
        "parentPhone": "0211833318",
        "notes": "Experience: 3 years of funded MGS guitar lessons\nOther instruments: Violin"
    },
    {
        "studentKey": "malea marsden|amyboss@temapua.com",
        "studentName": "Malea Marsden",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Amy Marsden",
        "parentEmail": "Amyboss@temapua.com",
        "parentPhone": "021628362",
        "notes": "Experience: Beginner"
    },
    {
        "studentKey": "isaac tilbury|richard.tilbury@hotmail.co.nz",
        "studentName": "isaac tilbury",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "richard tilbury",
        "parentEmail": "richard.tilbury@hotmail.co.nz",
        "parentPhone": "0223404736",
        "notes": "Experience: Isaac has been playing guitar for 2.5 years\nOther instruments: Can play bass"
    },
    {
        "studentKey": "jerrick dhale frasco pia|jeannettefrasco@yahoo.com",
        "studentName": "Jerrick Dhale Frasco Pia",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Jeannette Frasco Pia",
        "parentEmail": "jeannettefrasco@yahoo.com",
        "parentPhone": "2041192544",
        "notes": "Experience: Jerrick would want to change his preferred music lesson from Bass to Guitar as he wants to improve more on his guitar skills and to hone more improvisation of it, in his future\nOther instruments: Bass"
    },
    {
        "studentKey": "madeline posthuma|amposthuma1@gmail.com",
        "studentName": "Madeline Posthuma",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Michelle posthuma",
        "parentEmail": "amposthuma1@gmail.com",
        "parentPhone": "0274813888",
        "notes": "Experience: No experience - Already contacted Motoi\nOther instruments: Can play cello but changing to guitar"
    },
    {
        "studentKey": "lewis posthuma|amposthuma1@gmail.com",
        "studentName": "Lewis Posthuma",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Michelle Posthuma",
        "parentEmail": "amposthuma1@gmail.com",
        "parentPhone": "0274813888",
        "notes": "Experience: Completed the monster music guitar curriculum"
    },
    {
        "studentKey": "oliver owen|gjo@hotmail.co.nz",
        "studentName": "oliver owen",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "gareth owen",
        "parentEmail": "gjo@hotmail.co.nz",
        "parentPhone": "021755062",
        "notes": "Experience: 5 years experience\nOther instruments: drums and bass"
    },
    {
        "studentKey": "sara owen|gjo@hotmail.co.nz",
        "studentName": "sara owen",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "gareth owen",
        "parentEmail": "gjo@Hotmail.co.nz",
        "parentPhone": "021755062",
        "notes": "Experience: 2 years\nOther instruments: piano"
    },
    {
        "studentKey": "raymond im|yangcellina78@naver.com",
        "studentName": "Raymond Im",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Cellina Yang",
        "parentEmail": "yangcellina78@naver.com",
        "parentPhone": "0274270730",
        "notes": "Experience: Played in worship band\nOther instruments: Drums Saxophone"
    },
    {
        "studentKey": "christine jones|roderick.laura@xtra.co.nz",
        "studentName": "Christine Jones",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Laura Jones",
        "parentEmail": "roderick.laura@xtra.co.nz",
        "parentPhone": "0210317744",
        "notes": "Experience: Self taught for ~3 years on acoustic, 1 on electric\nOther instruments: Flute"
    },
    {
        "studentKey": "pedro kaue pellizzari|andholl@gmail.com",
        "studentName": "Pedro Kaue Pellizzari",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Andrea Hollmann",
        "parentEmail": "andholl@gmail.com",
        "parentPhone": "0212637708",
        "notes": "Experience: had lessons with you before. Could we please have the end of day slot again? or just after school? thansk"
    },
    {
        "studentKey": "sylvie watson|tonykristyw@tson.nz",
        "studentName": "Sylvie Watson",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Kristy Watson",
        "parentEmail": "tonykristyw@tson.nz",
        "parentPhone": "0212900797",
        "notes": "Experience: Lessons last term\nOther instruments: Piano, not sure grade"
    },
    {
        "studentKey": "ricky wu|lukewu19850816@gmail.com",
        "studentName": "Ricky Wu",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Can Wang",
        "parentEmail": "lukewu19850816@gmail.com",
        "parentPhone": "0275771874",
        "notes": "Experience: No grades yet\nOther instruments: Flute Grade 4 setting 6"
    },
    {
        "studentKey": "eliana edith humphrey|hilaryhumphreynz@gmail.com",
        "studentName": "Eliana Edith Humphrey",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Hilary Humphrey",
        "parentEmail": "hilaryhumphreynz@gmail.com",
        "parentPhone": "0211127761",
        "notes": "Experience: None"
    },
    {
        "studentKey": "xin-yang ethan shi|juliette.sun@icloud.com",
        "studentName": "Xin-Yang Ethan Shi",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Juliette Sun",
        "parentEmail": "juliette.sun@icloud.com",
        "parentPhone": "02102949588",
        "notes": "Experience: Started learning with Motoi since 2025\nOther instruments: Piano Grade 5 (Pending Exam)"
    },
    {
        "studentKey": "jerrick dhale pia|jeannettefrasco@yahoo.com",
        "studentName": "Jerrick Dhale Pia",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Jeannette Pia",
        "parentEmail": "jeannettefrasco@yahoo.com",
        "parentPhone": "02041192544",
        "notes": "Experience: Was in music lesson last year 11"
    },
    {
        "studentKey": "ephraim sinclair|jodiehasse@hotmail.com",
        "studentName": "Ephraim Sinclair",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": true,
        "parentName": "Jodie Sinclair",
        "parentEmail": "Jodiehasse@hotmail.com",
        "parentPhone": "0274905720",
        "notes": "Experience: In lessons last year\nOther instruments: No"
    },
    {
        "studentKey": "leaongo misa|ms_misa @xtra.co.nz",
        "studentName": "Leaongo Misa",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Sel Misa",
        "parentEmail": "ms_misa @xtra.co.nz",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "logan mcdowell|aimee @pulza.co.nz",
        "studentName": "Logan McDowell",
        "tutorName": "Motoi Shibusawa",
        "instrument": "Guitar",
        "funded": false,
        "parentName": "Aimee McDowell",
        "parentEmail": "aimee @pulza.co.nz",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "natalie rin|vjrin@live.com",
        "studentName": "Natalie Rin",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Janelle Rin",
        "parentEmail": "Vjrin@live.com",
        "parentPhone": "0272797775",
        "notes": "Experience: Not sure but Christine knows!\nStyle preference: Jazz;Pop;Classical;"
    },
    {
        "studentKey": "samuel mattingley|naiomi.mattingley@gmail.com",
        "studentName": "Samuel Mattingley",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "notes": "Experience: Grade 3\nOther instruments: Drums, 3 years' experience\nStyle preference: Classical;"
    },
    {
        "studentKey": "james mattingley|naiomi.mattingley@gmail.com",
        "studentName": "James Mattingley",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "notes": "Experience: 2 years' tuition\nStyle preference: Classical;"
    },
    {
        "studentKey": "abigail mattingley|naiomi.mattingley@gmail.com",
        "studentName": "Abigail Mattingley",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Naiomi Mattingley",
        "parentEmail": "naiomi.mattingley@gmail.com",
        "parentPhone": "0274751881",
        "notes": "Experience: 1.5 years' tuition\nStyle preference: Classical;"
    },
    {
        "studentKey": "xavier dendle|teamdendle@gmail.com",
        "studentName": "Xavier Dendle",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Leanne Dendle",
        "parentEmail": "Teamdendle@gmail.com",
        "parentPhone": "0273730334",
        "notes": "Experience: Grade 3\nStyle preference: Classical;Pop;Jazz;"
    },
    {
        "studentKey": "bianka yang|sgsuli@hotmail.com",
        "studentName": "Bianka Yang",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Suli",
        "parentEmail": "Sgsuli@hotmail.com",
        "parentPhone": "0212699965",
        "notes": "Experience: 7\nStyle preference: Classical;Jazz;Pop;"
    },
    {
        "studentKey": "jaegar yang|sgsuli@hotmail.com",
        "studentName": "Jaegar Yang",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Suli",
        "parentEmail": "Sgsuli@hotmail.com",
        "parentPhone": "0212699965",
        "notes": "Experience: 4\nStyle preference: Classical;Jazz;Pop;"
    },
    {
        "studentKey": "ella wei|jeff_wei55@hotmail.com",
        "studentName": "Ella Wei",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Zhiliang Wei",
        "parentEmail": "jeff_wei55@hotmail.com",
        "parentPhone": "0226166001",
        "notes": "Experience: Grade 3\nOther instruments: No\nStyle preference: Classical;"
    },
    {
        "studentKey": "amber judkins|judkins.family@xtra.co.nz",
        "studentName": "Amber Judkins",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Rhonda Judkins",
        "parentEmail": "judkins.family@xtra.co.nz",
        "parentPhone": "0272792829",
        "notes": "Experience: Learning for 10 years\nStyle preference: Classical;"
    },
    {
        "studentKey": "percy read|em.and.m.read@gmail.com",
        "studentName": "Percy Read",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Emma Read",
        "parentEmail": "Em.and.m.read@gmail.com",
        "parentPhone": "0211546793",
        "notes": "Experience: 2 years lessons\nStyle preference: Classical;Pop;Jazz;"
    },
    {
        "studentKey": "ethan mcconnell|sjmcconnell4@gmail.com",
        "studentName": "Ethan McConnell",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Jacqui McConnell",
        "parentEmail": "sjmcconnell4@gmail.com",
        "parentPhone": "0224236087",
        "notes": "Experience: Grade 8\nStyle preference: Classical;"
    },
    {
        "studentKey": "matthew smit|maggiesmit@hotmail.co.za",
        "studentName": "Matthew Smit",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Maggie Smit",
        "parentEmail": "Maggiesmit@hotmail.co.za",
        "parentPhone": "021881080",
        "notes": "Experience: Working towards grade 2 piano\nStyle preference: Classical;Jazz;Pop;"
    },
    {
        "studentKey": "phoenix wiegersma|oliviawiegersma5@gmail.com",
        "studentName": "Phoenix Wiegersma",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Olivia Wiegersma",
        "parentEmail": "Oliviawiegersma5@gmail.com",
        "parentPhone": "0211265722",
        "notes": "Experience: Has learnt for past few years.\nStyle preference: Classical"
    },
    {
        "studentKey": "cailin heathcote|chpsychologynz@gmail.com",
        "studentName": "Cailin Heathcote",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Claire Heathcote",
        "parentEmail": "chpsychologynz@gmail.com",
        "parentPhone": "0212437123",
        "notes": "Experience: Cailin did beginner guitar in 2025 with Ms Rudd. No piano experience though.\nOther instruments: Guitar beginner\nStyle preference: Pop;Classical"
    },
    {
        "studentKey": "faith emmanuelle dotulong|septioktaviani.so@gmail.com",
        "studentName": "Faith Emmanuelle Dotulong",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Septi Oktaviani",
        "parentEmail": "septioktaviani.so@gmail.com",
        "parentPhone": "02108376112",
        "notes": "Experience: piano lessons in 2025, and casual piano lessons for a few years before that\nStyle preference: Classical;Pop"
    },
    {
        "studentKey": "karston davie|brent.neeley.davie@gmail.com",
        "studentName": "Karston Davie",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Neeley Davie",
        "parentEmail": "brent.neeley.davie@gmail.com",
        "parentPhone": "0272477611",
        "notes": "Experience: Unsure plays chords and self taught but would like to upskill\nOther instruments: Guitar, which is his main instrument, we would like to keep his private lessons for guitar in place with Motoi\nStyle preference: Jazz;Pop"
    },
    {
        "studentKey": "jack uy|uypunlok@gmail.com",
        "studentName": "Jack Uy",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Frank Uy",
        "parentEmail": "uypunlok@gmail.com",
        "parentPhone": "02040563888",
        "notes": "Experience: He has been learning piano class with Christine for the whole year in 2025\nOther instruments: No\nStyle preference: Classical"
    },
    {
        "studentKey": "reuben gibbs|michelle.gibbs.nz@gmail.com",
        "studentName": "Reuben Gibbs",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Michelle Gibbs",
        "parentEmail": "michelle.gibbs.nz@gmail.com",
        "parentPhone": "021903039",
        "notes": "Experience: Beginner\nStyle preference: Classical"
    },
    {
        "studentKey": "austin posthuma|amposthuma1@gmail.com",
        "studentName": "Austin Posthuma",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Michelle Posthuma",
        "parentEmail": "amposthuma1@gmail.com",
        "parentPhone": "0274813888",
        "notes": "Experience: Been with Christine since yr7\nStyle preference: Classical;Jazz;Pop"
    },
    {
        "studentKey": "liam young|markandgina@gmail.com",
        "studentName": "Liam Young",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Gina Young",
        "parentEmail": "markandgina@gmail.com",
        "parentPhone": "0212940947",
        "notes": "Experience: last year played grade 8 pieces, didn't sit grade exam, excellence for year 12 music performance assessments\nOther instruments: baritone saxophone - beginner, french horn - beginner/one year's experience\nStyle preference: Classical;Jazz;Pop"
    },
    {
        "studentKey": "jaden konda|kondaswetha@gmail.com",
        "studentName": "Jaden Konda",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Swetha Devaputra",
        "parentEmail": "Kondaswetha@gmail.com",
        "parentPhone": "0224733447",
        "notes": "Experience: He is been learning it since past 2 years\nOther instruments: No\nStyle preference: Pop;Jazz;Classical;"
    },
    {
        "studentKey": "shelby rose jaquiery|nathandcarrie@yahoo.com",
        "studentName": "Shelby Rose Jaquiery",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "nathan jaquiery",
        "parentEmail": "nathandcarrie@yahoo.com",
        "parentPhone": "0276283663",
        "notes": "Experience: no experience\nOther instruments: no\nStyle preference: Classical;Jazz;Pop;"
    },
    {
        "studentKey": "aine sugiyama|excelnz.haruna@gmail.com",
        "studentName": "Aine SUGIYAMA",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Haruna Murakami",
        "parentEmail": "excelnz.haruna@gmail.com",
        "parentPhone": "02041295986",
        "notes": "Experience: 6 years\nStyle preference: Classical;Pop"
    },
    {
        "studentKey": "joshua gerretsen|esteg7@gmail.com",
        "studentName": "Joshua Gerretsen",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Este Gerretsen",
        "parentEmail": "Esteg7@gmail.com",
        "parentPhone": "021 08459725",
        "notes": "Experience: Josh has no piano experience but has been taking guitar lessons for the last 8 years and has music as a subject at school. However sometimes he struggles a bit with theory and would love to take piano to learn piano but also to help understan theory better.\nOther instruments: Guitar\nStyle preference: Classical"
    },
    {
        "studentKey": "mara verdes|bella0577@yahoo.com",
        "studentName": "Mara Verdes",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Isabela Verdes",
        "parentEmail": "bella0577@yahoo.com",
        "parentPhone": "0210582067",
        "notes": "Experience: Beginners\nOther instruments: None at this stage\nStyle preference: Classical"
    },
    {
        "studentKey": "bennett france|aliciagracefrance@gmail.com",
        "studentName": "Bennett France",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Alicia France",
        "parentEmail": "aliciagracefrance@gmail.com",
        "parentPhone": "021782655",
        "notes": "Experience: Beginner\nStyle preference: Classical"
    },
    {
        "studentKey": "zephath wasa|yinasimlawi@gmail.com",
        "studentName": "Zephath Wasa",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Yinasim Alibe",
        "parentEmail": "yinasimlawi@gmail.com",
        "parentPhone": "0226440729",
        "notes": "Experience: Started learning how to play the piano last year\nOther instruments: Piano -   learner\nStyle preference: Jazz"
    },
    {
        "studentKey": "ava catacutan|rosseyanne.1714@gmail.com",
        "studentName": "Ava Catacutan",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Rose Ann Santos",
        "parentEmail": "rosseyanne.1714@gmail.com",
        "parentPhone": "0212761120",
        "notes": "Experience: 0\nStyle preference: Classical;Pop"
    },
    {
        "studentKey": "sara owen|gjo@hotmail.co.nz",
        "studentName": "sara owen",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": true,
        "parentName": "gareth owen",
        "parentEmail": "gjo@hotmail.co.nz",
        "parentPhone": "021755062",
        "notes": "Experience: 3 years\nOther instruments: guitar\nStyle preference: Classical;Pop;Jazz"
    },
    {
        "studentKey": "tahlia trethowan|jamieetrethowan@live.com",
        "studentName": "Tahlia Trethowan",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "0275058818",
        "notes": "Experience: Tahlia is currently learning some grade 4 ABRSM material\nOther instruments: Cello 2 years-grade 5 (ish) level.\nStyle preference: Classical"
    },
    {
        "studentKey": "mila rose humphrey|hilaryhumphreynz@gmail.com",
        "studentName": "Mila Rose Humphrey",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Hilary Humphrey",
        "parentEmail": "hilaryhumphreynz@gmail.com",
        "parentPhone": "0211127761",
        "notes": "Experience: None\nStyle preference: Pop;Classical"
    },
    {
        "studentKey": "charlotte pelotin|1jpelotin@gmail.com",
        "studentName": "Charlotte Pelotin",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Jacqueline Pelotin",
        "parentEmail": "1jpelotin@gmail.com",
        "parentPhone": "021 02993157",
        "notes": ""
    },
    {
        "studentKey": "caitlin goodall|",
        "studentName": "Caitlin Goodall",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Joelle Goodall",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "amelia goodall|",
        "studentName": "Amelia Goodall",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Joelle Goodall",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "mya reynolds|",
        "studentName": "Mya Reynolds",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Ambra Reynolds",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "samuel hurren|",
        "studentName": "Samuel Hurren",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Rachael Hurren",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "charlie watson|",
        "studentName": "Charlie Watson",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Kirsty Watson",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "marcus neyra|",
        "studentName": "Marcus Neyra",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Michelle Neyra",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "jasmine cornish|",
        "studentName": "Jasmine Cornish",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Sara Cornish",
        "parentEmail": "",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "lydia cole|kendylcole87@gmail.com",
        "studentName": "Lydia Cole",
        "tutorName": "Christine Rudd",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Kendyl Cole",
        "parentEmail": "kendylcole87@gmail.com",
        "parentPhone": "021 852461",
        "notes": ""
    },
    {
        "studentKey": "mark ewing|aleciaewing137@gmail.com",
        "studentName": "Mark Ewing",
        "tutorName": "Christine Rudd",
        "instrument": "piano",
        "funded": false,
        "parentName": "Alecia Ewing",
        "parentEmail": "aleciaewing137@gmail.com",
        "parentPhone": "027 214 4610",
        "notes": ""
    },
    {
        "studentKey": "sophie pellow|r.c.pellow@xtra.co.nz",
        "studentName": "Sophie Pellow",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Catherine Pellow",
        "parentEmail": "r.c.pellow@xtra.co.nz",
        "parentPhone": "0211054005",
        "notes": "Experience: Sophie has had Lynley this year.\nOther instruments: No\nStyle preference: Classical;"
    },
    {
        "studentKey": "thomas you|fenwang0822@gmail.com",
        "studentName": "Thomas You",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Fen Wang",
        "parentEmail": "Fenwang0822@gmail.com",
        "parentPhone": "02108015003",
        "notes": "Experience: I am grade 4 in piano and I have been learning piano at Middleton for 2years\nOther instruments: Cello grade 6\nStyle preference: Jazz;Pop;Classical;"
    },
    {
        "studentKey": "arden monk|jaimie.monk@outlook.com",
        "studentName": "Arden Monk",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Jaimie Monk",
        "parentEmail": "jaimie.monk@outlook.com",
        "parentPhone": "021963291",
        "notes": "Experience: Approx grade 4-5. Arden has been doing lesson with Lynley for 2 years now.\nStyle preference: Classical;Jazz;"
    },
    {
        "studentKey": "billy minty|emily@mintdevelopments.co.nz",
        "studentName": "Billy Minty",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Emily Minty",
        "parentEmail": "Emily@mintdevelopments.co.nz",
        "parentPhone": "021 810 702",
        "notes": "Experience: Yes with same teacher really clicks with her\nStyle preference: Classical;Jazz;Pop;"
    },
    {
        "studentKey": "ihaia hikuroa|handlingmany@gmail.com",
        "studentName": "Ihaia Hikuroa",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Melanie Hikuroa",
        "parentEmail": "handlingmany@gmail.com",
        "parentPhone": "027 245 1997",
        "notes": "Experience: Learnt this year\nStyle preference: Classical;Pop;"
    },
    {
        "studentKey": "tiaho maia hikuroa|handlingmany@gmail.com",
        "studentName": "Tiaho Maia Hikuroa",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Melanie Hikuroa",
        "parentEmail": "handlingmany@gmail.com",
        "parentPhone": "027 245 1997",
        "notes": "Experience: Learnt this year\nStyle preference: Classical;Pop;"
    },
    {
        "studentKey": "angelique higgins|jane@peterdiver.co.nz",
        "studentName": "Angelique Higgins",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Jane Archbold",
        "parentEmail": "jane@peterdiver.co.nz",
        "parentPhone": "021577995",
        "notes": "Experience: previous lessons with Lynley\nStyle preference: Pop;"
    },
    {
        "studentKey": "zoe zheng|zbob0706@gmail.com",
        "studentName": "Zoe Zheng",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Bob Zheng",
        "parentEmail": "zbob0706@gmail.com",
        "parentPhone": "0274377779",
        "notes": "Experience: none\nOther instruments: a little piano and  recorder\nStyle preference: Classical"
    },
    {
        "studentKey": "gabriel perry|imeeperry@gmail.com",
        "studentName": "Gabriel Perry",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Imelda Perry",
        "parentEmail": "Imeeperry@gmail.com",
        "parentPhone": "0212120997",
        "notes": "Experience: Gabriel has been attending piano lessons with Mrs Lynley Fuglestad for 2 years now.\nStyle preference: Classical;Jazz;Pop"
    },
    {
        "studentKey": "ethan clancey|liesl.clancey@gmail.com",
        "studentName": "Ethan Clancey",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Liesl Clancey",
        "parentEmail": "liesl.clancey@gmail.com",
        "parentPhone": "0276221512",
        "notes": "Experience: Ethan has been learning with Lynley for the past 2 years and would like to continue please.\nStyle preference: Classical;Jazz;Pop"
    },
    {
        "studentKey": "sophia koshchienko|margarita8koshchienko@gmail.com",
        "studentName": "Sophia koshchienko",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Margarita koshchienko",
        "parentEmail": "Margarita8koshchienko@gmail.com",
        "parentPhone": "02108282804",
        "notes": "Experience: 2 years\nOther instruments: N/a\nStyle preference: Classical"
    },
    {
        "studentKey": "olivia kan|rachel.kan@live.com",
        "studentName": "Olivia Kan",
        "tutorName": "Susan Dollin",
        "instrument": "Flute",
        "funded": false,
        "parentName": "rachel kan",
        "parentEmail": "rachel.kan@live.com",
        "parentPhone": "02102252145",
        "notes": "Experience: Grade 4 , has taken flute since year 5."
    },
    {
        "studentKey": "valeria galaz duarte|yareni.duarte@gmail.com",
        "studentName": "Valeria Galaz Duarte",
        "tutorName": "Susan Dollin",
        "instrument": "Flute",
        "funded": true,
        "parentName": "Yareni Duarte Perea",
        "parentEmail": "yareni.duarte@gmail.com",
        "parentPhone": "0211594146",
        "notes": "Experience: 4 years playing flute\nOther instruments: Electric Guitar, 1 year"
    },
    {
        "studentKey": "moses petla|benjaminsudhanewzealand@gmail.com",
        "studentName": "Moses petla",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Sudha petla",
        "parentEmail": "Benjaminsudhanewzealand@gmail.com",
        "parentPhone": "0224355844",
        "notes": "Experience: Not much experience\nOther instruments: No\nStyle preference: Pop;Jazz;Classical"
    },
    {
        "studentKey": "henco sebastiaan de nysschen|elize.denysschen@gmail.com",
        "studentName": "Henco Sebastiaan de Nysschen",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": true,
        "parentName": "Elize de Nysschen",
        "parentEmail": "elize.denysschen@gmail.com",
        "parentPhone": "0273138708",
        "notes": "Experience: No experience\nOther instruments: Newby in guitar\nStyle preference: Classical"
    },
    {
        "studentKey": "grace maheswari|ribkawilda @gmail.com",
        "studentName": "Grace Maheswari",
        "tutorName": "Lynley Fuglestad",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Wilda Ribka",
        "parentEmail": "ribkawilda @gmail.com",
        "parentPhone": "",
        "notes": ""
    },
    {
        "studentKey": "eli highsted|jo.highsted@gmail.com",
        "studentName": "Eli Highsted",
        "tutorName": "Marina Oulton",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Jo Highsted",
        "parentEmail": "jo.highsted@gmail.com",
        "parentPhone": "02102742245",
        "notes": "Experience: Eli has had piano lessons with Marina this year.\nStyle preference: Jazz;Pop;Classical;"
    },
    {
        "studentKey": "jemima scoulding|simon.scoulding@gmail.com",
        "studentName": "Jemima Scoulding",
        "tutorName": "Marina Oulton",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Alice Scoulding",
        "parentEmail": "simon.scoulding@gmail.com",
        "parentPhone": "0226589739",
        "notes": "Experience: Has played for 2-3 years on and off\nOther instruments: Ukulele\nStyle preference: Classical;Pop"
    },
    {
        "studentKey": "alice caitlyn au|beks98@gmail.com",
        "studentName": "Alice Caitlyn Au",
        "tutorName": "Marina Oulton",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Rebekah Ruth Au",
        "parentEmail": "Beks98@gmail.com",
        "parentPhone": "0276342995",
        "notes": "Experience: Alice has had 5 terms with Marina\nStyle preference: Classical;Jazz;Pop"
    },
    {
        "studentKey": "jordan lucas au|beks98@gmail.com",
        "studentName": "Jordan Lucas Au",
        "tutorName": "Marina Oulton",
        "instrument": "Piano",
        "funded": false,
        "parentName": "Rebekah Ruth Au",
        "parentEmail": "Beks98@gmail.com",
        "parentPhone": "0276342995",
        "notes": "Experience: Jordan has had 4 terms with Marina\nStyle preference: Classical;Jazz;Pop"
    },
    {
        "studentKey": "ayala moe|we3moes@me.com",
        "studentName": "Ayala Moe",
        "tutorName": "Julian Marchant",
        "instrument": "Trumpet",
        "funded": true,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "notes": "Experience: Ayala has been learning for 4 years\nOther instruments: vocals"
    },
    {
        "studentKey": "joshua judkins|judkins.family@xtra.co.nz",
        "studentName": "Joshua Judkins",
        "tutorName": "Julian Marchant",
        "instrument": "Trombone",
        "funded": true,
        "parentName": "Rhonda Judkins",
        "parentEmail": "judkins.family@xtra.co.nz",
        "parentPhone": "0272792829",
        "notes": "Experience: Learning for 9 years\nOther instruments: Bass guitar"
    },
    {
        "studentKey": "jasper read|em.and.m.read@gmail.com",
        "studentName": "Jasper Read",
        "tutorName": "Julian Marchant",
        "instrument": "Trumpet",
        "funded": false,
        "parentName": "Emma Read",
        "parentEmail": "Em.and.m.read@gmail.com",
        "parentPhone": "0211546793",
        "notes": "Experience: 4 years tuition"
    },
    {
        "studentKey": "ephraim couperus|ljcouperus@gmail.com",
        "studentName": "Ephraim Couperus",
        "tutorName": "Julian Marchant",
        "instrument": "Trumpet",
        "funded": true,
        "parentName": "Joanna Couperus",
        "parentEmail": "ljcouperus@gmail.com",
        "parentPhone": "0274503833",
        "notes": "Experience: Six years\nOther instruments: Piano"
    },
    {
        "studentKey": "anastasia wright|elsybear@gmail.com",
        "studentName": "Anastasia Wright",
        "tutorName": "Julian Marchant",
        "instrument": "Trombone",
        "funded": false,
        "parentName": "Elsa Wright",
        "parentEmail": "elsybear@gmail.com",
        "parentPhone": "02040911911",
        "notes": "Experience: Anastasia started in 2025, so she's in the first level."
    },
    {
        "studentKey": "kira weston|gns4life@gmail.com",
        "studentName": "Kira Weston",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Sophia Weston",
        "parentEmail": "Gns4life@gmail.com",
        "parentPhone": "02102536884",
        "notes": "Experience: 3years with Julie Petitt"
    },
    {
        "studentKey": "daniel yeo|chwee@yeoz.com",
        "studentName": "Daniel Yeo",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Chwee-Wei Chan",
        "parentEmail": "chwee@yeoz.com",
        "parentPhone": "0223936614",
        "notes": "Experience: Learning violin from Julie Petitt more than 10 yrs at Middlteton."
    },
    {
        "studentKey": "verity oldham|markandbri@gmail.com",
        "studentName": "Verity Oldham",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Briarne Oldham",
        "parentEmail": "markandbri@gmail.com",
        "parentPhone": "027 460 1575",
        "notes": "Experience: Violin - grade 2 ABRSM. Singing - two years as a member of the Junior Representative Choir for the Chch Schools Music Festival."
    },
    {
        "studentKey": "abigail zarah iyjo|sumi.iyjo@gmail.com",
        "studentName": "Abigail Zarah Iyjo",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Sumi Issac",
        "parentEmail": "Sumi.iyjo@gmail.com",
        "parentPhone": "02102886457",
        "notes": "Experience: None\nOther instruments: No"
    },
    {
        "studentKey": "eliana chyn hui wong|dkp.wong@gmail.com",
        "studentName": "Eliana Chyn Hui Wong",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": true,
        "parentName": "David King Poh Wong",
        "parentEmail": "dkp.wong@gmail.com",
        "parentPhone": "0272483327",
        "notes": "Experience: No experience on Violin but love the sound of it when her close friend played.\nOther instruments: Piano, Doing Grade 5 exam in 2026"
    },
    {
        "studentKey": "grace maheswari|ribkawilda@gmail.com",
        "studentName": "Grace Maheswari",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Wilda Ribka",
        "parentEmail": "ribkawilda@gmail.com",
        "parentPhone": "02040120212",
        "notes": "Experience: Grace has not had previous experience with the violin at all.  We would also need to hire a violin, though we don't know what size she would need. Also, thought it's worth mentioning that we are still exploring our options/shopping around but so far this is very promising because it's right there at the school :)"
    },
    {
        "studentKey": "joseph su|minwueve@mail.com",
        "studentName": "Joseph Su",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Eve Wu",
        "parentEmail": "Minwueve@mail.com",
        "parentPhone": "02108341898",
        "notes": "Experience: Had 2 years of violin tutoring, all the way up to grade 4 in ABRSM\nOther instruments: No"
    },
    {
        "studentKey": "addison trethowan|jamieetrethowan@live.com",
        "studentName": "Addison Trethowan",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Jamiee Trethowan",
        "parentEmail": "jamieetrethowan@live.com",
        "parentPhone": "027 505 8818",
        "notes": "Experience: 18 months previous tuition with Julie\nOther instruments: Piano: pre-grade level"
    },
    {
        "studentKey": "evie hope|hope.jessicamarie@gmail.com",
        "studentName": "Evie Hope",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Jessica Hope",
        "parentEmail": "hope.jessicamarie@gmail.com",
        "parentPhone": "02102482313",
        "notes": "Experience: None\nOther instruments: No other instruments"
    },
    {
        "studentKey": "zoe fyfe|fyfewhanau@gmail.com",
        "studentName": "Zoe Fyfe",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Vivienne Fyfe",
        "parentEmail": "fyfewhanau@gmail.com",
        "parentPhone": "0211089327",
        "notes": "Experience: Zoe has been learning off Julie Pettit at school for a number of years."
    },
    {
        "studentKey": "grant su|minwueve@gmail.com",
        "studentName": "Grant Su",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Min Wu",
        "parentEmail": "minwueve@gmail.com",
        "parentPhone": "021 083 41898",
        "notes": ""
    },
    {
        "studentKey": "joseph su|minwueve@gmail.com",
        "studentName": "Joseph Su",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Min Wu",
        "parentEmail": "minwueve@gmail.com",
        "parentPhone": "021 083 41898",
        "notes": ""
    },
    {
        "studentKey": "eliana wong|meihsienh@yahoo.co.nz",
        "studentName": "Eliana Wong",
        "tutorName": "Julie Pettitt",
        "instrument": "Violin",
        "funded": false,
        "parentName": "Mei Hsien Ho Joyce",
        "parentEmail": "meihsienh@yahoo.co.nz",
        "parentPhone": "021 103 1201",
        "notes": ""
    },
    {
        "studentKey": "wilf lowe|megs_lowe@yahoo.co.nz",
        "studentName": "Wilf Lowe",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Megan Lowe",
        "parentEmail": "megs_lowe@yahoo.co.nz",
        "parentPhone": "021454912",
        "notes": "Experience: Currently in private lessons with Elizabeth\nOther instruments: Guitar - private lessons with Motoi. May have to discontinue either guitar or vocals private lessons due to costs."
    },
    {
        "studentKey": "zoey harrison|justinharrison@yahoo.com",
        "studentName": "Zoey Harrison",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Mrs Lisa Harrison",
        "parentEmail": "justinharrison@yahoo.com",
        "parentPhone": "021 305 310",
        "notes": "Experience: Yr11 music class lessons ,church music and church choir\nOther instruments: Ukulele and keyboard"
    },
    {
        "studentKey": "jasmine xie|sunshan0323@gmail.com",
        "studentName": "Jasmine Xie",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Shan Sun(Fiona)",
        "parentEmail": "sunshan0323@gmail.com",
        "parentPhone": "02108515665",
        "notes": "Experience: None"
    },
    {
        "studentKey": "keziah's horn|rhian.horn@gmail.com",
        "studentName": "Keziah's Horn",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Rhian Horn",
        "parentEmail": "Rhian.horn@gmail.com",
        "parentPhone": "0279644289",
        "notes": "Experience: 3 years with Mrs Macfarlane"
    },
    {
        "studentKey": "carla van der nest|riaan@vdnest.co.nz",
        "studentName": "Carla van der Nest",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Riaan van der Nest",
        "parentEmail": "Riaan@vdNest.co.nz",
        "parentPhone": "021461472",
        "notes": "Experience: Took Music in Y9, focusing on vocals\nOther instruments: N/a"
    },
    {
        "studentKey": "lucy penno|joy.penno65@gmail.com",
        "studentName": "Lucy Penno",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Joy Penno",
        "parentEmail": "joy.penno65@gmail.com",
        "parentPhone": "0221368326",
        "notes": "Experience: Vocal lessons 3+ years"
    },
    {
        "studentKey": "isabel moe|we3moes@me.com",
        "studentName": "Isabel Moe",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "notes": "Experience: Isabel has been learning for 2-3 years outside of school."
    },
    {
        "studentKey": "ayala moe|we3moes@me.com",
        "studentName": "Ayala Moe",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Ellie Moe",
        "parentEmail": "we3moes@me.com",
        "parentPhone": "0212676688",
        "notes": "Experience: Ayala has had 2 years learning vocals\nOther instruments: Trumpet"
    },
    {
        "studentKey": "mia wang|wangna.chch@gmail.com",
        "studentName": "Mia Wang",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Na Wang",
        "parentEmail": "wangna.chch@gmail.com",
        "parentPhone": "021880563",
        "notes": "Experience: School choirs\nOther instruments: No"
    },
    {
        "studentKey": "anja jennings|sisijennings5@gmail.com",
        "studentName": "Anja Jennings",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Sisi Zhuang",
        "parentEmail": "sisijennings5@gmail.com",
        "parentPhone": "0273053713",
        "notes": "Experience: Piano and Chinese Zither but not vocals yet.\nOther instruments: Piano and Chinese zither (harp). Please get back to me about this application. We applied twice in the last two years. Thanks."
    },
    {
        "studentKey": "elysia hartstonge|matt.hartstonge@gmail.com",
        "studentName": "Elysia Hartstonge",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Matthew Hartstonge",
        "parentEmail": "matt.hartstonge@gmail.com",
        "parentPhone": "02102795686",
        "notes": "Experience: Singing Group 2024, Ensemble Mary Poppins\nOther instruments: n/a"
    },
    {
        "studentKey": "emma wu|abc100111310@hotmail.com",
        "studentName": "Emma Wu",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Xin Wu",
        "parentEmail": "abc100111310@hotmail.com",
        "parentPhone": "0212606121",
        "notes": "Experience: Classic ballet, Primary(RQF)\nOther instruments: non"
    },
    {
        "studentKey": "ella-rose mcconnell|sjmcconnell4@gmail.com",
        "studentName": "Ella-Rose McConnell",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Jacqui McConnell",
        "parentEmail": "sjmcconnell4@gmail.com",
        "parentPhone": "0224236087",
        "notes": "Experience: Singing in church band and singing in school musical\nOther instruments: Drums  7years of lessons"
    },
    {
        "studentKey": "imri dinnissen|ahdfamily@gmail.com",
        "studentName": "imri dinnissen",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Helena Dinnissen",
        "parentEmail": "ahdfamily@gmail.com",
        "parentPhone": "0276415474",
        "notes": "Experience: just school production"
    },
    {
        "studentKey": "verity oldham|markandbri@gmail.com",
        "studentName": "Verity Oldham",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Briarne Oldham",
        "parentEmail": "markandbri@gmail.com",
        "parentPhone": "027 460 1575",
        "notes": "Experience: Violin - grade 2 ABRSM. Singing - two years"
    },
    {
        "studentKey": "lillie birse|lissa@functiongroup.co.nz",
        "studentName": "Lillie Birse",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Lissa Birse",
        "parentEmail": "lissa@functiongroup.co.nz",
        "parentPhone": "021973973",
        "notes": "Experience: Nil"
    },
    {
        "studentKey": "bree bennetts|bennettsfamilynz@gmail.com",
        "studentName": "Bree Bennetts",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Jo Bennetts",
        "parentEmail": "Bennettsfamilynz@gmail.com",
        "parentPhone": "0211453511",
        "notes": "Experience: 4 years, currently working at grade 5 level with Elizabeth MacFarlane"
    },
    {
        "studentKey": "karston davie|brent.neeley.davie@gmail.com",
        "studentName": "Karston Davie",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Neeley Davie",
        "parentEmail": "brent.neeley.davie@gmail.com",
        "parentPhone": "0272477611",
        "notes": "Experience: Singing lessons for all of 2025\nOther instruments: Guitar and piano"
    },
    {
        "studentKey": "quinn dendle|teamdendle@gmail.com",
        "studentName": "Quinn Dendle",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Leanne Dendle",
        "parentEmail": "Teamdendle@gmail.com",
        "parentPhone": "0273730334",
        "notes": "Experience: Group singing lessons 2025"
    },
    {
        "studentKey": "lienka muller|elanza@playball.co.nz",
        "studentName": "Lienka Muller",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Elanza Muller",
        "parentEmail": "elanza@playball.co.nz",
        "parentPhone": "0225658925",
        "notes": "Experience: Singing - guitar\nOther instruments: Guitar - beginner"
    },
    {
        "studentKey": "adelia orr|dankatorr@gmail.com",
        "studentName": "Adelia Orr",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Katherine Orr",
        "parentEmail": "dankatorr@gmail.com",
        "parentPhone": "0273748137",
        "notes": "Experience: Vocal - 3 years of lessons with Mrs MacFarlane\nOther instruments: Guitar - self-taught"
    },
    {
        "studentKey": "tiffany norriss|hongnorriss@gmail.com",
        "studentName": "Tiffany Norriss",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": false,
        "parentName": "Linda Norriss",
        "parentEmail": "hongnorriss@gmail.com",
        "parentPhone": "0276940108",
        "notes": "Experience: Year 7 and 8 choir for two years\nOther instruments: Pinao grade 5"
    },
    {
        "studentKey": "katrina melody watts|jacqui_honeypot@hotmail.com",
        "studentName": "Katrina Melody Watts",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Jacqueline Watts",
        "parentEmail": "jacqui_honeypot@hotmail.com",
        "parentPhone": "02102717977",
        "notes": "Experience: Singing lessons for 2 years at Buller High School with Revd Rona Halsall; school musicals - singing part; school choir involvement at primary school; voice instruction as part of the 2025 National Youth Theatre program CATS\nOther instruments: Cello - passed Trinity Gr 3 in October 2025 (requiring itinerant lessons for Cello while at school); drums - 2 years during primary school years; piano - 3 years during primary school."
    },
    {
        "studentKey": "anya flora wong|floratie@gmail.com",
        "studentName": "Anya Flora Wong",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Flora Tie",
        "parentEmail": "floratie@gmail.com",
        "parentPhone": "021802834",
        "notes": "Experience: No.\nOther instruments: Basic piano and guitar"
    },
    {
        "studentKey": "sloane ramsay|kellandruth@ramsay.org.nz",
        "studentName": "Sloane Ramsay",
        "tutorName": "Elizabeth Macfarlane",
        "instrument": "Vocals",
        "funded": true,
        "parentName": "Ruth Ramsay",
        "parentEmail": "kellandruth@ramsay.org.nz",
        "parentPhone": "0211121947",
        "notes": "Experience: Has done group lessons the last couple of years.\nOther instruments: N/A"
    }
];

async function runImport() {
    console.log('MGS Arts Portal - Lesson Import');
    console.log('==================================');

    // Step 0: Import Firebase modules and connect to Firestore
    console.log('\nLoading Firebase...');
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getFirestore, collection, getDocs, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    // Re-use existing Firebase app if available, otherwise init
    let app;
    try {
        const { getApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
        app = getApp();
    } catch (e) {
        app = initializeApp({
            apiKey: "AIzaSyCL2ZHktfHNsFX6vI0mVY-i5WqM1Hb94RY",
            authDomain: "mgs-performing-arts.firebaseapp.com",
            projectId: "mgs-performing-arts",
            storageBucket: "mgs-performing-arts.firebasestorage.app",
            messagingSenderId: "968636316312",
            appId: "1:968636316312:web:1b233ae8e176ceea85aeed"
        });
    }
    const db = getFirestore(app);
    console.log('Firebase connected');

    // Helper: get all docs from a collection
    async function getAll(colName) {
        const snapshot = await getDocs(collection(db, colName));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    // Helper: add a doc to a collection
    async function addOne(colName, data) {
        try {
            const docRef = await addDoc(collection(db, colName), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Load existing tutors
    console.log('\nLoading existing tutors...');
    const tutors = await getAll('tutors');
    if (!tutors || tutors.length === 0) {
        console.error('No tutors found in Firestore. Please add tutors first.');
        return;
    }

    const tutorLookup = {};
    tutors.forEach(t => {
        tutorLookup[t.name.toLowerCase().trim()] = t;
    });
    console.log(`Found ${tutors.length} tutors:`, tutors.map(t => t.name).join(', '));

    // Validate tutor mappings
    const requiredTutors = [...new Set(LESSONS.map(l => l.tutorName))];
    const missing = requiredTutors.filter(t => !tutorLookup[t.toLowerCase().trim()]);
    if (missing.length > 0) {
        console.error('Missing tutors:', missing);
        console.log('Available:', Object.keys(tutorLookup));
        return;
    }
    console.log('All tutor mappings validated');

    // Step 1: Create students
    console.log(`\nCreating ${STUDENTS.length} students...`);
    const studentIdMap = {};
    let studentOk = 0, studentErr = 0;

    for (const student of STUDENTS) {
        const key = `${student.name.toLowerCase().trim()}|${(student.parentEmail || '').toLowerCase().trim()}`;
        const result = await addOne('students', student);
        if (result.success) {
            studentIdMap[key] = result.id;
            studentOk++;
            if (studentOk % 20 === 0) console.log(`  ... ${studentOk} students created`);
        } else {
            console.error(`  Failed: ${student.name}`, result.error);
            studentErr++;
        }
    }
    console.log(`Students: ${studentOk} created, ${studentErr} errors`);

    // Step 2: Create lessons
    console.log(`\nCreating ${LESSONS.length} lessons...`);
    let lessonOk = 0, lessonErr = 0;

    for (const l of LESSONS) {
        const studentId = studentIdMap[l.studentKey];
        const tutor = tutorLookup[l.tutorName.toLowerCase().trim()];

        if (!studentId) {
            console.error(`  No student ID for: ${l.studentName} (key: ${l.studentKey})`);
            lessonErr++;
            continue;
        }

        const lesson = {
            studentId: studentId,
            studentName: l.studentName,
            tutorId: tutor.id,
            tutorName: tutor.name,
            instrument: l.instrument,
            day: '',
            time: '',
            status: 'active',
            funded: l.funded,
            parentName: l.parentName,
            parentEmail: l.parentEmail,
            parentPhone: l.parentPhone,
            notes: l.notes
        };

        const result = await addOne('lessons', lesson);
        if (result.success) {
            lessonOk++;
            if (lessonOk % 20 === 0) console.log(`  ... ${lessonOk} lessons created`);
        } else {
            console.error(`  Failed: ${l.studentName} - ${l.instrument}`, result.error);
            lessonErr++;
        }
    }
    console.log(`Lessons: ${lessonOk} created, ${lessonErr} errors`);

    // Summary
    console.log('\n==================================');
    console.log('Import complete!');
    console.log(`   Students: ${studentOk}`);
    console.log(`   Lessons:  ${lessonOk}`);
    console.log(`   Errors:   ${studentErr + lessonErr}`);
    console.log('\nReload the page to see the imported data.');
}
