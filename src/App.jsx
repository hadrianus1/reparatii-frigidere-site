import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import {
  FaPhone, FaWhatsapp, FaCheck, FaTrash, FaEdit,
  FaStar, FaRegStar, FaChevronDown, FaChevronLeft, FaChevronRight,
  FaReply, FaPlus, FaTimes, FaEye, FaEyeSlash,
  FaMapMarkerAlt, FaShieldAlt, FaTools,
  FaThermometerHalf, FaWind, FaBolt, FaMicrochip, FaSnowflake,
  FaThumbsUp, FaThumbsDown, FaHeart, FaUpload, FaImages, FaYoutube,
  FaEnvelope, FaClock, FaFacebook,
} from "react-icons/fa";

const YOUTUBE_URL = "https://www.youtube.com/channel/UC3UWS-FoCuzUIGZrlb4HQqA";
const FACEBOOK_URL = "https://www.facebook.com/reparatii.frigider";
const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/4DwxLKT5YEjaiYXb8";

// ===== GALLERY IMAGES (served locally from /public) =====

const GALLERY = [
  { url: "/reparatii_frigidere_opris_adrian_1.jpeg", caption: "Opriș Adrian — tehnician autorizat AGFR" },
  { url: "/img_20200401_211609.jpg", caption: "Reparație combină frigorifică" },
  { url: "/reparatii_module_electronice_frigidere.jpeg", caption: "Reparații module electronice frigidere" },
  { url: "/img_20191017_212608.jpg", caption: "Reparație frigider la domiciliu" },
  { url: "/reparatii_frigidere_ariston_1.jpeg", caption: "Reparații frigidere Ariston" },
  { url: "/img_20200619_050005.jpg", caption: "Schimb compresor frigider" },
  { url: "/opris_adrian_pfa_reparatii_frigidere.jpeg", caption: "Opriș Adrian PFA — reparații frigidere" },
  { url: "/reparatii_placi_electronice_domiciliu.jpeg", caption: "Reparații plăci electronice la domiciliu" },
  { url: "/img_20200519_142720.jpg", caption: "Intervenție tehnică la fața locului" },
  { url: "/reparatii_frigidere_indesit.jpeg", caption: "Reparații frigidere Indesit" },
  { url: "/img_20200712_234828.jpg", caption: "Reparație frigider Side-by-Side cu dozator de apă" },
  { url: "/reparatii_frigidere_ariston_2.jpeg", caption: "Service frigidere Ariston" },
  { url: "/img_20200924_040848.jpg", caption: "Service frigider No-Frost" },
  { url: "/reparatii_frigidere_opris_adrian_2.jpeg", caption: "Reparații frigidere la domiciliu" },
  { url: "/inlocuire_vaporizator_frigider_arctic.jpeg", caption: "Înlocuire vaporizator frigider Arctic" },
  { url: "/frigider.jpg", caption: "Reparație frigider" },
  { url: "/img_20200401_211511.jpg", caption: "Diagnosticare defecțiune frigider" },
  { url: "/frigider1.jpeg", caption: "Diagnosticare și reparare frigider" },
  { url: "/reparatii_frigidere_bucuresti.jpeg", caption: "Reparații frigidere București" },
  { url: "/frigider2.jpeg", caption: "Intervenție rapidă la domiciliu" },
  { url: "/frigotehnist.jpeg", caption: "Frigotehnist autorizat la lucru" },
];

// ===== HELPERS =====

// ===== ZONES MAP DATA =====
// Real administrative boundaries (OpenStreetMap / Nominatim, simplified), projected
// with a single consistent equirectangular transform so the sectors and the
// surrounding towns line up correctly against each other — not two different
// hand-drawn sources stitched together. Roșu (a village inside Chiajna commune)
// and Militari Residence (a private residential development) aren't independent
// administrative units, so they render as plain points instead of shapes.

const SECTOR_PATHS = {
  1: "M -740.1,-333.0 L -670.4,-406.1 L -617.2,-416.0 L -582.5,-410.6 L -489.3,-366.2 L -447.6,-328.3 L -430.7,-329.7 L -424.2,-338.1 L -411.2,-334.2 L -413.3,-329.0 L -420.4,-332.1 L -427.1,-316.7 L -421.3,-318.8 L -423.0,-323.0 L -417.2,-320.2 L -419.1,-313.1 L -416.1,-320.3 L -410.1,-317.7 L -414.3,-311.1 L -372.4,-295.4 L -347.8,-274.1 L -342.8,-279.5 L -341.4,-272.1 L -325.9,-258.7 L -313.3,-266.5 L -307.6,-262.0 L -313.0,-252.3 L -272.9,-223.0 L -268.3,-226.3 L -251.9,-216.7 L -249.1,-213.5 L -253.6,-210.8 L -243.8,-194.1 L -236.1,-198.5 L -225.3,-191.9 L -232.2,-189.7 L -231.4,-187.1 L -238.7,-184.4 L -238.3,-183.2 L -229.0,-186.9 L -227.6,-178.5 L -221.1,-179.1 L -217.1,-156.2 L -208.3,-144.8 L -212.2,-163.1 L -203.6,-165.9 L -202.5,-156.0 L -208.0,-142.9 L -204.9,-134.1 L -193.2,-128.3 L -187.5,-130.9 L -189.3,-124.5 L -184.0,-124.3 L -182.3,-117.1 L -175.9,-118.4 L -174.9,-109.6 L -170.8,-114.4 L -168.5,-111.4 L -172.2,-107.0 L -162.6,-104.3 L -162.9,-97.5 L -157.2,-103.8 L -159.9,-94.5 L -156.7,-98.6 L -156.2,-90.6 L -149.8,-92.3 L -152.8,-86.8 L -149.3,-81.9 L -140.7,-88.1 L -147.2,-77.7 L -140.2,-76.8 L -145.1,-73.1 L -138.2,-65.7 L -143.0,-59.5 L -141.5,-55.5 L -158.9,-42.8 L -128.1,-20.4 L -103.3,-9.7 L -102.5,-28.8 L -92.4,-28.2 L -93.1,-21.8 L -87.5,-21.3 L -75.0,-28.7 L -71.2,-10.3 L -65.3,-10.5 L -64.4,-15.8 L -48.3,-11.7 L -53.0,-15.9 L -46.7,-12.4 L -46.5,-17.0 L -31.4,-11.8 L -33.3,-14.9 L -27.6,-18.0 L -26.2,-11.5 L -7.7,-12.1 L -7.6,-15.8 L -0.3,-12.2 L 3.5,-18.6 L 22.8,-12.4 L 44.9,-24.0 L 57.7,-22.1 L 64.8,-32.8 L 58.8,-41.4 L 43.6,-37.7 L 47.0,-41.1 L 41.0,-44.8 L 42.9,-51.8 L 38.1,-59.3 L 38.5,-70.9 L 44.0,-70.2 L 40.9,-79.2 L 53.9,-86.2 L 52.5,-101.9 L 56.4,-100.4 L 61.0,-107.8 L 54.2,-128.4 L 59.9,-139.8 L 51.9,-143.7 L 59.1,-147.6 L 53.3,-159.8 L 43.2,-161.3 L 43.9,-170.0 L 40.8,-171.7 L 40.1,-180.5 L 48.1,-180.5 L 39.0,-191.3 L 43.2,-213.3 L 38.6,-225.3 L 49.5,-301.8 L 55.6,-302.7 L 51.0,-306.6 L 56.8,-318.7 L 65.9,-315.0 L 58.1,-321.0 L 62.1,-329.7 L 67.0,-328.5 L 68.7,-332.6 L 64.2,-334.4 L 68.6,-344.8 L 74.3,-344.5 L 68.6,-347.5 L 66.1,-363.2 L 57.7,-379.8 L 64.8,-381.2 L 63.0,-389.8 L 71.7,-393.3 L 56.6,-412.4 L 48.2,-409.1 L 44.7,-417.7 L 51.0,-423.4 L 44.2,-434.6 L 49.2,-474.2 L 58.0,-425.3 L 52.6,-463.4 L 69.6,-461.6 L 82.9,-445.9 L 70.1,-462.9 L 68.8,-487.3 L 93.5,-482.3 L 102.6,-483.0 L 103.1,-487.1 L 128.3,-483.1 L 129.2,-487.0 L 101.9,-515.6 L 108.6,-529.6 L 90.8,-570.3 L 83.9,-566.6 L 79.8,-571.3 L 61.8,-613.8 L 64.4,-619.5 L 96.2,-629.2 L 89.7,-652.3 L 59.7,-643.5 L 51.9,-678.1 L 62.2,-748.8 L 65.1,-748.7 L 64.5,-739.2 L 69.1,-738.9 L 73.6,-764.7 L 65.4,-766.2 L 61.6,-777.6 L 65.8,-836.8 L 54.6,-864.8 L 62.3,-954.9 L 45.4,-955.4 L 45.0,-965.2 L 39.2,-965.0 L 38.2,-971.6 L 19.1,-970.1 L 19.0,-963.3 L 12.1,-962.8 L 13.6,-952.1 L -71.1,-943.1 L -109.8,-933.1 L -116.2,-965.6 L -139.8,-971.5 L -163.9,-953.4 L -168.3,-912.7 L -286.7,-869.7 L -291.1,-880.9 L -295.8,-878.3 L -292.9,-867.4 L -393.7,-811.0 L -420.8,-848.3 L -454.8,-832.2 L -464.8,-805.9 L -450.9,-781.4 L -446.2,-780.3 L -526.4,-735.6 L -532.1,-743.1 L -537.0,-739.4 L -540.4,-743.0 L -554.0,-732.3 L -554.7,-722.9 L -548.0,-713.5 L -553.4,-704.0 L -567.7,-596.3 L -593.4,-588.6 L -618.3,-590.4 L -642.5,-561.8 L -688.0,-595.8 L -716.6,-581.4 L -718.6,-572.2 L -709.8,-568.4 L -714.5,-554.4 L -686.6,-533.3 L -698.4,-521.8 L -687.3,-528.0 L -712.7,-446.9 L -733.2,-401.5 L -740.1,-333.0 Z",
  2: "M 37.9,-64.8 L 42.9,-51.8 L 41.0,-44.8 L 47.0,-41.1 L 43.6,-37.7 L 58.8,-41.4 L 65.1,-32.1 L 57.7,-22.1 L 74.8,-22.8 L 88.9,-2.0 L 95.0,-9.1 L 114.8,-12.8 L 127.2,2.5 L 131.3,-4.3 L 145.6,-0.6 L 148.8,-6.1 L 148.0,0.4 L 163.0,-2.4 L 176.3,3.7 L 184.0,-4.0 L 187.3,3.4 L 199.3,8.0 L 213.2,3.9 L 213.0,9.1 L 239.4,14.4 L 278.7,8.2 L 280.2,13.5 L 293.6,10.5 L 295.7,16.2 L 321.3,14.4 L 325.4,7.7 L 327.0,13.5 L 378.8,8.0 L 409.9,-4.6 L 409.1,-8.3 L 415.6,-5.0 L 421.0,-12.9 L 422.1,-8.5 L 432.2,-8.2 L 470.0,-15.9 L 468.2,-30.0 L 481.3,-33.6 L 508.5,-28.6 L 516.7,-32.3 L 533.0,-25.4 L 544.8,-29.3 L 545.4,-38.8 L 553.6,-40.6 L 553.0,-32.3 L 560.3,-26.5 L 559.7,-19.5 L 567.9,-33.0 L 576.7,-37.3 L 582.6,-15.9 L 597.8,-38.9 L 621.0,-54.4 L 630.8,-70.5 L 660.3,-82.0 L 649.5,-110.8 L 631.9,-120.7 L 621.6,-118.4 L 597.7,-93.3 L 558.4,-113.0 L 530.0,-98.0 L 520.7,-98.5 L 513.7,-103.9 L 511.3,-113.0 L 529.8,-146.9 L 531.2,-181.0 L 511.8,-181.5 L 477.7,-155.5 L 461.0,-175.3 L 443.1,-180.4 L 435.0,-176.9 L 424.2,-186.2 L 401.1,-189.7 L 393.2,-198.0 L 445.6,-286.1 L 539.5,-397.2 L 556.3,-409.4 L 579.1,-411.0 L 128.9,-485.5 L 103.1,-487.1 L 102.6,-483.0 L 93.5,-482.3 L 68.8,-487.3 L 70.1,-462.9 L 82.9,-445.9 L 69.6,-461.6 L 52.6,-463.4 L 58.0,-425.3 L 56.7,-425.7 L 49.2,-474.2 L 44.2,-436.4 L 51.0,-423.4 L 44.7,-417.7 L 48.2,-409.1 L 56.6,-412.4 L 71.7,-393.3 L 63.0,-389.8 L 64.8,-381.2 L 57.7,-379.8 L 66.1,-363.2 L 68.6,-347.5 L 74.3,-344.5 L 68.6,-344.8 L 64.2,-334.4 L 68.7,-332.6 L 67.0,-328.5 L 62.1,-329.7 L 58.1,-321.0 L 65.9,-315.0 L 56.8,-318.7 L 51.0,-306.6 L 55.6,-302.7 L 49.5,-301.8 L 47.5,-294.1 L 40.3,-239.7 L 38.6,-225.3 L 43.2,-213.3 L 39.0,-191.3 L 48.1,-180.5 L 40.1,-180.5 L 40.6,-173.0 L 43.2,-161.3 L 53.3,-159.8 L 59.1,-147.6 L 51.9,-143.7 L 59.9,-139.8 L 54.2,-128.4 L 61.0,-107.8 L 56.4,-100.4 L 52.5,-101.9 L 53.9,-86.2 L 42.1,-81.0 L 44.0,-70.2 L 38.5,-70.9 L 40.8,-64.8 L 37.9,-64.8 Z",
  3: "M 5.4,16.3 L 12.1,21.7 L 8.0,25.3 L 11.7,35.1 L 41.9,43.2 L 41.1,65.9 L 79.5,69.6 L 88.9,75.4 L 108.0,132.8 L 166.5,208.8 L 188.7,227.7 L 533.4,352.1 L 561.7,356.9 L 754.1,345.3 L 751.6,313.3 L 766.7,308.5 L 761.9,305.0 L 755.1,272.3 L 742.9,264.3 L 737.6,265.0 L 734.6,274.0 L 727.8,270.7 L 730.8,254.6 L 752.7,259.7 L 748.0,243.7 L 792.4,233.5 L 795.2,220.5 L 790.5,147.9 L 793.6,133.2 L 814.8,137.8 L 823.2,99.5 L 833.4,80.8 L 809.8,71.6 L 810.5,63.8 L 822.4,63.9 L 840.5,9.3 L 833.4,7.5 L 820.5,16.6 L 798.8,20.6 L 789.0,12.6 L 773.2,-13.8 L 750.3,3.9 L 735.5,-0.3 L 717.8,-19.6 L 708.0,-48.6 L 676.1,-47.3 L 662.1,-53.5 L 654.9,-68.2 L 661.9,-77.9 L 660.3,-82.0 L 630.8,-70.5 L 621.0,-54.4 L 597.8,-38.9 L 582.6,-15.9 L 576.7,-37.3 L 567.9,-33.0 L 559.7,-19.5 L 560.3,-26.5 L 553.0,-32.3 L 553.6,-40.6 L 545.4,-38.8 L 544.8,-29.3 L 533.0,-25.4 L 516.7,-32.3 L 508.5,-28.6 L 481.3,-33.6 L 468.2,-30.0 L 470.0,-15.9 L 432.2,-8.2 L 422.1,-8.5 L 421.0,-12.9 L 415.6,-5.0 L 409.1,-8.3 L 409.9,-4.6 L 378.8,8.0 L 327.0,13.5 L 325.4,7.7 L 321.3,14.4 L 295.7,16.2 L 293.6,10.5 L 280.2,13.5 L 278.7,8.2 L 239.4,14.4 L 213.0,9.1 L 213.2,3.9 L 199.3,8.0 L 187.3,3.4 L 184.0,-4.0 L 176.3,3.7 L 163.0,-2.4 L 148.0,0.4 L 148.8,-6.1 L 145.6,-0.6 L 131.3,-4.3 L 127.2,2.5 L 114.8,-12.8 L 95.0,-9.1 L 88.9,-2.0 L 74.8,-22.8 L 44.9,-24.0 L 20.9,-13.1 L 22.5,-8.9 L 9.5,2.6 L 5.4,16.3 Z",
  4: "M -71.6,451.3 L -61.2,458.1 L -58.5,474.5 L -42.8,480.4 L -21.5,478.8 L -21.7,484.6 L -26.9,486.0 L -23.5,493.6 L -26.7,493.1 L -33.5,512.2 L -27.6,515.3 L -31.5,519.1 L -37.5,550.8 L -32.7,554.2 L -48.3,551.5 L -33.9,596.5 L -26.9,596.1 L -8.1,634.8 L 0.2,632.6 L 4.4,661.2 L 7.6,660.8 L 8.3,649.2 L 20.1,640.6 L 27.6,592.8 L 120.8,610.5 L 112.7,652.8 L 228.8,740.2 L 209.8,765.8 L 333.1,860.6 L 331.2,865.4 L 338.7,864.3 L 367.4,892.7 L 396.7,881.1 L 400.9,862.2 L 394.4,846.6 L 444.7,825.1 L 439.9,816.3 L 462.8,808.2 L 447.0,779.7 L 427.3,790.7 L 368.9,683.9 L 360.2,656.0 L 346.0,629.5 L 340.3,628.4 L 320.2,596.4 L 314.2,585.3 L 317.8,582.7 L 314.6,576.7 L 308.9,575.9 L 321.9,552.7 L 313.9,544.6 L 345.2,497.0 L 338.8,493.3 L 362.5,446.2 L 366.2,448.2 L 431.8,315.3 L 188.7,227.7 L 166.5,208.8 L 108.0,132.8 L 88.9,75.4 L 79.5,69.6 L 41.1,65.9 L 41.9,43.2 L 35.3,39.3 L 11.7,35.1 L 6.7,44.0 L 1.1,43.1 L 3.7,47.8 L -9.8,50.1 L -10.5,61.5 L 0.2,67.1 L -7.2,71.8 L -9.0,68.0 L -15.6,74.3 L -14.6,78.5 L -28.3,83.7 L -29.3,99.1 L -37.5,98.5 L -38.9,117.3 L -45.6,125.6 L -38.4,137.3 L -41.9,139.1 L -32.3,140.6 L -22.9,155.9 L -7.4,165.5 L -10.7,174.3 L -24.1,173.2 L -36.1,200.1 L -26.8,191.0 L -20.4,193.9 L -23.5,202.0 L -13.4,219.9 L 1.6,232.4 L -0.9,244.7 L 5.8,250.4 L 12.9,268.7 L -4.8,277.9 L 0.2,285.1 L -17.6,302.7 L -14.3,307.1 L -2.3,297.9 L 10.4,304.5 L 3.9,324.0 L -20.2,332.3 L -2.9,328.7 L 4.0,330.0 L -1.3,330.5 L -4.9,341.6 L -0.7,343.7 L -5.1,342.1 L -10.3,352.6 L -12.2,358.5 L -6.9,357.1 L -25.0,406.8 L -21.3,408.4 L -24.7,418.6 L -21.3,420.5 L -25.1,431.6 L -17.7,433.4 L -44.7,466.8 L -59.3,439.5 L -71.6,451.3 Z",
  5: "M -633.6,241.0 L -626.7,275.6 L -593.2,269.5 L -587.7,285.7 L -539.2,249.1 L -426.1,393.6 L -419.0,393.1 L -407.8,405.5 L -383.9,382.7 L -355.8,417.1 L -396.8,452.3 L -315.1,526.1 L -306.9,501.7 L -261.9,516.3 L -248.7,485.1 L -166.0,529.1 L -163.3,515.0 L -148.6,490.2 L -114.5,498.2 L -125.1,553.0 L -90.0,569.7 L -39.9,578.2 L -48.3,551.5 L -32.7,554.2 L -37.5,550.8 L -31.5,519.1 L -27.6,515.3 L -33.5,512.2 L -26.7,493.1 L -23.5,493.6 L -26.9,486.0 L -21.7,484.6 L -21.5,478.8 L -42.8,480.4 L -58.5,474.5 L -61.2,458.1 L -71.6,451.3 L -59.3,439.5 L -44.7,466.8 L -17.7,433.4 L -25.1,431.6 L -21.3,420.5 L -24.7,418.6 L -21.3,408.4 L -25.0,406.8 L -6.9,357.1 L -12.2,358.5 L -10.3,352.6 L -5.1,342.1 L -0.7,343.7 L -4.9,341.6 L -1.3,330.5 L 4.0,330.0 L -2.9,328.7 L -20.2,332.3 L 3.9,324.0 L 10.4,304.5 L -2.3,297.9 L -14.3,307.1 L -17.6,302.7 L 0.2,285.1 L -4.8,277.9 L 12.9,268.7 L 5.8,250.4 L -0.9,244.7 L 1.6,232.4 L -13.4,219.9 L -23.5,202.0 L -20.4,193.9 L -26.8,191.0 L -35.1,202.1 L -36.1,200.1 L -24.1,173.2 L -10.7,174.3 L -7.4,165.5 L -22.9,155.9 L -32.3,140.6 L -41.9,139.1 L -38.4,137.3 L -45.6,125.6 L -38.9,117.3 L -37.5,98.5 L -29.3,99.1 L -28.3,83.7 L -14.6,78.5 L -15.6,74.3 L -9.0,68.0 L -7.2,71.8 L 0.2,67.1 L -10.5,61.5 L -9.8,50.1 L 3.7,47.8 L 1.1,43.1 L 6.7,44.0 L 7.3,37.7 L 11.0,37.8 L 12.7,33.0 L 8.0,25.3 L 12.1,21.7 L 5.4,16.3 L 8.1,5.4 L 22.5,-8.9 L 3.5,-18.6 L -0.3,-12.2 L -7.6,-15.8 L -7.7,-12.1 L -26.2,-11.5 L -27.6,-18.0 L -33.3,-14.9 L -31.4,-11.8 L -46.5,-17.0 L -46.7,-12.4 L -53.0,-15.9 L -48.3,-11.7 L -64.4,-15.8 L -65.3,-10.5 L -71.2,-10.3 L -74.5,-28.2 L -79.0,-29.4 L -79.5,-23.5 L -87.5,-21.3 L -93.1,-21.8 L -92.4,-28.2 L -102.5,-28.8 L -103.3,-9.7 L -128.1,-20.4 L -158.9,-42.8 L -157.4,-35.9 L -165.4,-37.3 L -165.9,-32.5 L -167.2,-35.8 L -198.5,-17.5 L -224.7,-9.2 L -224.8,16.1 L -212.6,48.8 L -221.1,54.6 L -218.7,75.4 L -224.2,82.8 L -220.7,84.8 L -221.9,111.6 L -227.3,111.7 L -220.3,121.9 L -238.2,137.5 L -236.3,141.7 L -248.8,145.0 L -245.1,154.6 L -259.0,162.4 L -263.7,151.6 L -268.4,153.5 L -263.8,166.9 L -271.7,170.3 L -269.6,185.7 L -297.9,198.0 L -328.4,201.2 L -327.3,209.1 L -312.6,207.0 L -310.3,213.0 L -308.3,224.1 L -318.3,234.1 L -356.5,224.2 L -357.5,213.8 L -358.9,217.0 L -373.0,209.2 L -392.7,245.9 L -417.6,233.5 L -409.2,213.1 L -412.7,211.2 L -388.0,175.3 L -400.1,178.1 L -425.2,212.6 L -428.0,212.9 L -405.4,178.2 L -410.1,183.7 L -410.4,178.9 L -424.4,181.2 L -435.4,190.1 L -429.6,182.1 L -433.7,183.1 L -440.7,191.8 L -435.8,183.5 L -442.7,191.4 L -445.8,189.2 L -443.2,184.3 L -452.1,194.9 L -455.0,193.0 L -448.5,185.1 L -467.3,188.5 L -484.4,207.3 L -487.4,205.2 L -476.9,190.3 L -485.0,195.9 L -488.3,192.1 L -498.6,204.3 L -503.7,203.5 L -506.3,195.2 L -503.5,208.6 L -513.0,224.3 L -528.4,222.4 L -532.1,204.2 L -546.1,209.8 L -547.9,202.8 L -545.2,225.2 L -608.1,236.1 L -614.1,214.2 L -611.2,228.3 L -615.2,229.1 L -613.9,236.6 L -633.6,241.0 Z",
  6: "M -823.3,-65.7 L -819.6,15.5 L -816.7,15.4 L -804.7,124.6 L -796.6,156.9 L -761.5,243.5 L -723.7,234.0 L -679.8,234.8 L -637.9,217.5 L -633.6,241.0 L -624.8,239.7 L -613.9,236.6 L -612.5,213.8 L -608.1,236.1 L -548.0,225.8 L -545.0,217.7 L -547.9,202.8 L -546.1,209.8 L -532.1,204.2 L -528.4,222.4 L -513.0,224.3 L -503.5,208.6 L -506.3,195.2 L -503.7,203.5 L -498.6,204.3 L -488.3,192.1 L -485.0,195.9 L -476.9,190.3 L -487.4,205.2 L -484.4,207.3 L -467.3,188.5 L -448.5,185.1 L -455.0,193.0 L -452.1,194.9 L -443.2,184.3 L -445.8,189.2 L -442.7,191.4 L -435.8,183.5 L -440.7,191.8 L -433.7,183.1 L -429.6,182.1 L -435.4,190.1 L -424.4,181.2 L -410.4,178.9 L -410.1,183.7 L -405.4,178.2 L -428.0,212.9 L -425.2,212.6 L -400.1,178.1 L -388.0,175.3 L -412.7,211.2 L -409.2,213.1 L -417.6,233.5 L -392.7,245.9 L -373.0,209.2 L -358.9,217.0 L -357.5,213.8 L -356.5,224.2 L -318.3,234.1 L -308.3,224.1 L -310.3,213.0 L -312.6,207.0 L -327.3,209.1 L -328.4,201.2 L -297.9,198.0 L -269.6,185.7 L -271.7,170.3 L -263.8,166.9 L -268.4,153.5 L -263.7,151.6 L -259.0,162.4 L -245.1,154.6 L -248.8,145.0 L -236.3,141.7 L -238.2,137.5 L -220.3,121.9 L -227.3,111.7 L -221.9,111.6 L -220.7,84.8 L -224.2,82.8 L -218.7,75.4 L -221.1,54.6 L -212.6,48.8 L -224.8,16.1 L -224.7,-9.2 L -198.5,-17.5 L -167.2,-35.8 L -165.9,-32.5 L -165.4,-37.3 L -157.4,-35.9 L -159.6,-41.8 L -141.5,-55.5 L -143.0,-59.5 L -138.2,-65.7 L -145.1,-73.1 L -141.0,-78.0 L -147.2,-77.7 L -140.7,-88.1 L -149.3,-81.9 L -152.8,-86.8 L -149.8,-92.3 L -156.2,-90.6 L -156.7,-98.6 L -159.9,-94.5 L -157.2,-103.8 L -162.9,-97.5 L -162.6,-104.3 L -172.2,-107.0 L -168.5,-111.4 L -170.8,-114.4 L -174.9,-109.6 L -175.9,-118.4 L -182.3,-117.1 L -184.0,-124.3 L -189.3,-124.5 L -187.5,-130.9 L -193.2,-128.3 L -204.9,-134.1 L -208.0,-142.9 L -202.5,-156.0 L -203.6,-165.9 L -212.2,-163.1 L -208.3,-144.8 L -217.1,-156.2 L -221.1,-179.1 L -227.6,-178.5 L -229.0,-186.9 L -238.3,-183.2 L -226.4,-193.5 L -236.1,-198.5 L -243.8,-194.1 L -253.6,-210.8 L -249.1,-213.5 L -251.9,-216.7 L -268.3,-226.3 L -272.9,-223.0 L -313.0,-252.3 L -307.6,-262.0 L -313.3,-266.5 L -325.9,-258.7 L -341.4,-272.1 L -342.8,-279.5 L -347.8,-274.1 L -372.4,-295.4 L -414.3,-311.1 L -410.1,-317.7 L -416.1,-320.3 L -419.1,-313.1 L -417.2,-320.2 L -423.0,-323.0 L -421.3,-318.8 L -427.1,-316.7 L -420.4,-332.1 L -413.3,-329.0 L -411.2,-334.2 L -424.2,-338.1 L -430.7,-329.7 L -444.4,-326.9 L -489.3,-366.2 L -582.5,-410.6 L -611.7,-416.1 L -660.1,-410.3 L -678.7,-400.6 L -760.5,-308.3 L -755.1,-303.4 L -763.6,-296.7 L -762.5,-289.5 L -724.2,-302.4 L -597.1,-243.3 L -567.0,-224.2 L -523.1,-221.2 L -507.0,-197.6 L -524.5,-186.1 L -522.1,-167.9 L -513.6,-157.5 L -514.5,-146.2 L -506.5,-141.1 L -493.8,-146.0 L -481.9,-134.5 L -485.4,-113.1 L -529.9,-85.6 L -823.3,-65.7 Z",
};

const SECTOR_LABEL_POS = {
  1: [-222.6, -521.3], 2: [279.0, -222.7], 3: [477.6, 139.4],
  4: [182.0, 459.6], 5: [-209.5, 278.9], 6: [-494.3, -40.1],
};

const ZONE_SECTORS = [1, 2, 3, 4, 5, 6].map(n => ({ id: `sector-${n}`, name: `Sector ${n}` }));

// x/y are fitted so every point actually falls inside its sector's real shape above
// (verified with isPointInFill, not just eyeballed against a bounding box).
const ZONE_NEIGHBORHOODS = [
  { id: "baneasa", name: "Băneasa", sector: 1, x: -382.2, y: -797.8 },
  { id: "pipera", name: "Pipera", sector: 1, x: -301.7, y: -816.5 },
  { id: "aviatiei", name: "Aviației", sector: 1, x: -425.1, y: -723.9 },
  { id: "grivita", name: "Grivița", sector: 1, x: -325, y: -607.2 },
  { id: "dorobanti", name: "Dorobanți", sector: 1, x: -357.6, y: -682.2 },
  { id: "floreasca", name: "Floreasca", sector: 1, x: -311.4, y: -711.7 },
  { id: "otopeni", name: "Otopeni", sector: 1, x: -104.0, y: -1138.3 },
  { id: "colentina", name: "Colentina", sector: 2, x: 340.7, y: -392.1 },
  { id: "obor", name: "Obor", sector: 2, x: 309, y: -334.6 },
  { id: "iancului", name: "Iancului", sector: 2, x: 370.1, y: -331.2 },
  { id: "pantelimon", name: "Pantelimon", sector: 2, x: 433.8, y: -377.5 },
  { id: "dristor", name: "Dristor", sector: 3, x: 606.2, y: 104.9 },
  { id: "vitan", name: "Vitan", sector: 3, x: 634.9, y: 167.1 },
  { id: "titan", name: "Titan", sector: 3, x: 690.5, y: 139.4 },
  { id: "tineretului", name: "Tineretului", sector: 4, x: 265.5, y: 543.2 },
  { id: "vacaresti", name: "Văcărești", sector: 4, x: 235.8, y: 607.6 },
  { id: "berceni", name: "Berceni", sector: 4, x: 293.5, y: 652.9 },
  { id: "rahova", name: "Rahova", sector: 5, x: -244.4, y: 409 },
  { id: "ferentari", name: "Ferentari", sector: 5, x: -330.7, y: 400.1 },
  { id: "crangasi", name: "Crângași", sector: 6, x: -621.4, y: -74.2 },
  { id: "giulesti", name: "Giulești", sector: 6, x: -655.1, y: -40.1 },
  { id: "drumul-taberei", name: "Drumul Taberei", sector: 6, x: -692, y: 12.9 },
  { id: "militari", name: "Militari", sector: 6, x: -756.5, y: -17.2 },
];

// Real boundaries for the surrounding towns/communes (OSM, simplified). Otopeni is
// listed under "neighborhoods" above for the chip grouping/text, but renders as a
// real shape here just like the other towns.
const AREA_PATHS = {
  otopeni: { name: "Otopeni", path: "M -436.8,-869.0 L -393.7,-811.0 L -292.9,-867.4 L -295.8,-878.3 L -291.1,-880.9 L -286.7,-869.7 L -168.3,-912.7 L -163.9,-953.4 L -139.8,-971.5 L -116.2,-965.6 L -109.8,-933.1 L -71.1,-943.1 L 13.6,-952.1 L 12.1,-962.8 L 19.0,-963.3 L 19.1,-970.1 L 38.2,-971.6 L 39.2,-965.0 L 45.0,-965.2 L 45.4,-955.4 L 62.3,-954.9 L 79.8,-1037.8 L 90.2,-1054.7 L 89.2,-1076.4 L 169.2,-1106.6 L 171.9,-1124.0 L 154.4,-1146.4 L 141.0,-1178.9 L 139.0,-1194.4 L 182.9,-1202.2 L 181.9,-1222.9 L 156.0,-1219.1 L 148.1,-1274.0 L 156.5,-1275.0 L 144.9,-1376.5 L 138.0,-1403.8 L 134.0,-1402.1 L 124.0,-1445.1 L 54.6,-1420.3 L 44.2,-1410.8 L 21.7,-1402.9 L 19.1,-1406.2 L -38.7,-1393.4 L -166.1,-1355.0 L -204.5,-1332.6 L -421.7,-983.2 L -406.9,-990.3 L -388.8,-987.6 L -330.6,-919.6 L -436.8,-869.0 Z", label: [-104.0, -1138.3] },
  voluntari: { name: "Voluntari", path: "M 51.8,-685.2 L 59.7,-643.5 L 89.7,-652.3 L 96.2,-629.2 L 64.4,-619.5 L 61.8,-613.8 L 79.8,-571.3 L 83.9,-566.6 L 90.8,-570.3 L 108.6,-529.6 L 101.9,-515.6 L 131.1,-484.1 L 579.1,-411.0 L 626.4,-456.2 L 601.7,-479.2 L 633.5,-504.0 L 647.7,-513.2 L 670.9,-491.3 L 715.3,-506.7 L 750.9,-531.2 L 695.3,-599.2 L 705.3,-608.3 L 700.9,-614.1 L 707.3,-619.9 L 703.6,-623.9 L 713.4,-638.5 L 711.0,-656.7 L 697.8,-667.5 L 681.9,-675.9 L 647.9,-655.8 L 563.7,-752.0 L 446.8,-838.0 L 323.7,-915.8 L 201.2,-945.3 L 163.5,-952.3 L 62.3,-954.9 L 54.6,-864.8 L 65.8,-836.8 L 61.6,-777.6 L 65.4,-766.2 L 73.6,-764.7 L 69.1,-738.9 L 64.5,-739.2 L 65.1,-748.7 L 62.2,-748.8 L 51.8,-685.2 Z", label: [347.8, -666.4] },
  chiajna: { name: "Chiajna", path: "M -1170.7,-23.8 L -1101.2,12.4 L -1080.4,6.4 L -1069.5,48.4 L -1027.0,45.2 L -1005.7,53.8 L -932.8,26.8 L -920.8,2.4 L -913.6,3.3 L -900.3,-34.1 L -832.3,-23.9 L -833.3,-14.3 L -839.0,-12.3 L -837.4,9.3 L -831.2,9.0 L -830.3,16.1 L -819.6,15.5 L -823.3,-65.7 L -529.9,-85.6 L -485.4,-113.1 L -481.9,-134.5 L -493.8,-146.0 L -506.5,-141.1 L -514.5,-146.2 L -513.6,-157.5 L -522.1,-167.9 L -524.5,-186.1 L -507.0,-197.6 L -523.1,-221.2 L -567.0,-224.2 L -597.1,-243.3 L -724.2,-302.4 L -762.5,-289.5 L -763.6,-296.7 L -755.1,-303.4 L -761.1,-307.5 L -741.0,-331.4 L -736.7,-343.9 L -752.5,-346.5 L -752.7,-354.0 L -761.4,-357.4 L -769.1,-351.2 L -767.2,-340.3 L -785.0,-334.7 L -806.9,-319.2 L -821.2,-326.8 L -854.1,-330.3 L -871.0,-281.0 L -910.4,-275.1 L -886.8,-200.0 L -909.6,-160.8 L -958.1,-57.2 L -1042.8,-51.5 L -1170.7,-23.8 Z", label: [-786.3, -143.7] },
  domnesti: { name: "Domnești", path: "M -1534.2,491.7 L -1529.6,506.7 L -1532.8,526.1 L -1526.8,548.8 L -1497.6,566.2 L -1470.4,597.9 L -1463.6,594.3 L -1452.1,599.6 L -1447.9,612.5 L -1432.3,617.7 L -1435.9,623.8 L -1428.2,630.7 L -1408.3,606.4 L -1406.1,610.3 L -1378.9,594.5 L -1342.2,558.3 L -1213.6,451.3 L -1194.7,473.4 L -1139.6,428.2 L -1107.8,466.5 L -1078.8,446.9 L -1076.6,436.9 L -1080.2,423.1 L -1074.4,407.7 L -1092.8,388.1 L -1003.4,321.7 L -998.8,328.6 L -992.3,327.6 L -986.2,309.3 L -958.9,289.6 L -932.2,280.6 L -934.4,271.0 L -851.5,268.2 L -761.5,243.5 L -802.5,135.1 L -816.7,15.4 L -830.3,16.1 L -831.2,9.0 L -837.4,9.3 L -839.0,-12.3 L -833.3,-14.3 L -832.3,-23.9 L -900.3,-34.1 L -913.6,3.3 L -920.8,2.4 L -932.8,26.8 L -1005.7,53.8 L -1027.0,45.2 L -1069.5,48.4 L -1080.4,6.4 L -1170.2,34.3 L -1164.9,45.8 L -1215.0,76.6 L -1229.1,62.3 L -1249.1,79.7 L -1250.3,87.6 L -1257.6,89.4 L -1262.2,97.8 L -1260.3,102.1 L -1265.4,106.5 L -1413.4,214.8 L -1402.9,223.6 L -1404.7,212.2 L -1399.3,212.8 L -1397.3,229.5 L -1383.5,226.1 L -1380.8,235.5 L -1383.9,240.7 L -1397.1,240.5 L -1411.6,251.1 L -1416.5,262.3 L -1496.8,298.8 L -1504.9,315.9 L -1498.7,328.9 L -1506.0,347.3 L -1509.6,374.4 L -1534.1,407.7 L -1524.0,415.9 L -1520.5,426.1 L -1528.7,441.0 L -1522.8,455.3 L -1534.2,491.7 Z", label: [-1175.6, 274.0] },
  clinceni: { name: "Clinceni", path: "M -1456.8,651.0 L -1444.3,684.4 L -1427.9,696.0 L -1404.9,702.9 L -1375.4,685.5 L -1315.7,679.9 L -1305.9,691.1 L -1301.0,705.3 L -1304.5,729.6 L -1321.1,773.0 L -1305.9,762.6 L -1293.2,738.1 L -1253.2,685.4 L -1260.9,664.0 L -1168.5,610.1 L -1112.8,664.1 L -1050.2,614.0 L -1041.0,628.3 L -1070.5,653.5 L -1062.7,666.2 L -1106.5,690.3 L -1097.5,707.9 L -995.9,650.9 L -1020.6,623.1 L -1013.1,616.9 L -1030.0,592.5 L -1042.1,598.9 L -1057.4,578.3 L -995.0,533.2 L -981.9,510.2 L -960.2,533.4 L -949.8,565.3 L -927.2,572.3 L -918.8,594.7 L -907.5,595.9 L -802.7,516.1 L -802.0,507.5 L -773.1,482.4 L -780.1,465.6 L -778.2,461.4 L -723.8,461.8 L -693.1,443.9 L -701.4,434.9 L -710.5,438.7 L -727.5,412.6 L -716.7,403.5 L -718.9,395.0 L -708.6,387.5 L -712.2,381.8 L -708.1,379.7 L -744.5,289.0 L -764.4,289.2 L -771.9,270.3 L -767.6,261.3 L -757.8,257.3 L -763.5,243.8 L -851.5,268.2 L -934.4,271.0 L -932.2,280.6 L -958.9,289.6 L -986.2,309.3 L -992.3,327.6 L -998.8,328.6 L -1003.4,321.7 L -1092.8,388.1 L -1074.4,407.7 L -1080.2,423.1 L -1076.6,436.9 L -1078.8,446.9 L -1107.8,466.5 L -1139.6,428.2 L -1194.7,473.4 L -1213.6,451.3 L -1342.2,558.3 L -1378.9,594.5 L -1406.1,610.3 L -1408.3,606.4 L -1428.2,630.7 L -1435.9,623.8 L -1432.3,617.7 L -1447.9,612.5 L -1444.3,624.5 L -1452.2,631.9 L -1456.8,651.0 Z", label: [-1035.2, 488.2] },
  bragadiru: { name: "Bragadiru", path: "M -1057.4,578.3 L -1042.1,598.9 L -1030.0,592.5 L -1013.1,616.9 L -1020.6,623.1 L -971.0,677.7 L -949.2,659.4 L -892.2,691.6 L -889.3,686.4 L -860.6,702.7 L -867.1,709.4 L -855.2,724.0 L -849.9,719.4 L -853.9,715.3 L -837.1,700.4 L -803.6,722.8 L -783.1,690.4 L -779.5,693.8 L -771.5,682.8 L -732.5,682.0 L -736.1,675.2 L -720.3,669.5 L -719.6,647.8 L -729.5,639.5 L -565.7,532.1 L -533.2,567.5 L -355.8,417.1 L -383.9,382.7 L -407.8,405.5 L -419.0,393.1 L -426.1,393.6 L -539.2,249.1 L -587.7,285.7 L -593.2,269.5 L -626.7,275.6 L -637.9,217.5 L -679.8,234.8 L -730.3,235.2 L -763.5,243.8 L -757.8,257.3 L -767.6,261.3 L -771.9,270.3 L -764.4,289.2 L -744.5,289.0 L -708.1,379.7 L -712.2,381.8 L -708.6,387.5 L -718.9,395.0 L -716.7,403.5 L -727.5,412.6 L -710.5,438.7 L -701.4,434.9 L -693.1,443.9 L -723.8,461.8 L -778.2,461.4 L -780.1,465.6 L -773.1,482.4 L -802.0,507.5 L -802.7,516.1 L -905.9,595.3 L -918.8,594.7 L -927.2,572.3 L -949.8,565.3 L -960.2,533.4 L -981.9,510.2 L -995.0,533.2 L -1057.4,578.3 Z", label: [-682.3, 477.8] },
  cornetu: { name: "Cornetu", path: "M -1343.8,786.5 L -1338.7,801.9 L -1328.2,808.0 L -1298.3,798.6 L -1271.7,802.8 L -1264.1,825.5 L -1254.4,838.4 L -1210.1,880.0 L -1192.6,909.8 L -1182.6,918.1 L -1156.7,916.5 L -1081.3,877.2 L -1041.8,876.9 L -1018.0,889.2 L -964.4,942.9 L -917.4,951.6 L -908.9,975.7 L -897.1,965.5 L -886.9,938.4 L -884.7,916.8 L -855.4,866.8 L -885.3,849.5 L -855.5,788.6 L -821.7,806.4 L -811.8,788.6 L -779.5,800.0 L -753.3,755.3 L -837.1,700.4 L -853.9,715.3 L -849.9,719.4 L -855.2,724.0 L -867.1,709.4 L -860.6,702.7 L -889.3,686.4 L -892.2,691.6 L -949.2,659.4 L -971.0,677.7 L -996.1,651.0 L -1097.5,707.9 L -1106.5,690.3 L -1062.7,666.2 L -1070.5,653.5 L -1041.0,628.3 L -1050.2,614.0 L -1112.8,664.1 L -1168.5,610.1 L -1260.9,664.0 L -1253.2,685.4 L -1270.6,711.4 L -1293.2,738.1 L -1310.0,767.2 L -1341.0,780.5 L -1343.8,786.5 Z", label: [-1053.7, 779.5] },
  magurele: { name: "Măgurele", path: "M -940.9,1031.9 L -935.5,1044.2 L -922.3,1052.7 L -908.3,1050.3 L -898.3,1057.0 L -856.9,1062.4 L -827.5,1053.2 L -800.0,1022.0 L -802.9,1006.4 L -815.8,983.0 L -814.2,967.6 L -807.3,957.2 L -788.7,952.2 L -767.3,959.1 L -757.0,993.9 L -749.8,1001.6 L -718.5,1024.0 L -655.7,1047.8 L -642.5,1070.2 L -634.9,1065.5 L -634.3,1058.2 L -614.9,1028.4 L -578.9,1013.2 L -557.3,1018.5 L -547.0,1027.8 L -541.7,1044.0 L -532.1,1044.8 L -481.2,962.0 L -472.4,966.1 L -462.6,948.6 L -431.7,875.0 L -442.5,874.8 L -429.0,844.4 L -376.9,853.1 L -342.2,836.7 L -327.8,862.6 L -311.7,866.5 L -262.5,911.6 L -253.0,911.3 L -230.0,862.4 L -177.2,794.8 L -166.4,783.2 L -160.6,784.5 L -153.5,769.9 L -157.3,768.1 L -64.1,648.5 L -60.6,624.6 L -57.0,626.9 L -55.8,622.6 L -59.6,620.2 L -55.8,607.7 L -61.5,606.0 L -54.5,595.2 L -55.7,576.6 L -90.0,569.7 L -125.1,553.0 L -114.5,498.2 L -148.6,490.2 L -163.3,515.0 L -166.0,529.1 L -248.7,485.1 L -261.9,516.3 L -306.9,501.7 L -315.1,526.1 L -396.8,452.3 L -533.2,567.5 L -565.7,532.1 L -729.5,639.5 L -720.1,646.8 L -717.8,660.8 L -720.3,669.5 L -736.1,675.2 L -732.5,682.0 L -762.9,679.8 L -771.5,682.8 L -779.5,693.8 L -783.1,690.4 L -803.6,722.8 L -753.3,755.3 L -779.5,800.0 L -811.8,788.6 L -821.7,806.4 L -855.5,788.6 L -885.3,849.5 L -855.4,866.8 L -884.7,916.8 L -886.9,938.4 L -897.1,965.5 L -908.9,975.7 L -905.9,982.1 L -908.8,993.2 L -935.9,1011.7 L -934.8,1025.8 L -940.9,1031.9 Z", label: [-492.1, 755.9] },
  "popesti-leordeni": { name: "Popești-Leordeni", path: "M 293.2,869.1 L 301.7,921.1 L 442.4,895.8 L 471.5,876.4 L 443.7,825.9 L 515.4,791.1 L 521.4,800.1 L 517.5,805.0 L 519.6,809.1 L 535.8,827.4 L 646.4,916.0 L 651.5,917.7 L 680.9,880.1 L 779.8,950.2 L 747.2,996.2 L 1024.2,1217.2 L 1163.3,1046.0 L 876.8,819.1 L 958.0,727.2 L 798.4,608.6 L 802.1,552.2 L 820.4,525.0 L 813.1,516.7 L 814.0,510.5 L 783.3,506.3 L 800.4,494.5 L 798.3,491.4 L 834.0,484.1 L 844.5,471.3 L 850.7,451.1 L 846.6,433.4 L 818.5,386.4 L 814.8,336.5 L 753.7,340.1 L 754.1,345.3 L 556.4,356.7 L 431.5,316.2 L 366.2,448.2 L 362.5,446.2 L 338.8,493.3 L 345.2,497.0 L 313.9,544.6 L 321.9,552.7 L 308.9,575.9 L 314.6,576.7 L 317.8,582.7 L 314.2,585.3 L 320.2,596.4 L 340.3,628.4 L 346.0,629.5 L 360.2,656.0 L 368.9,683.9 L 427.3,790.7 L 447.0,779.7 L 462.8,808.2 L 439.9,816.3 L 444.7,825.1 L 394.4,846.6 L 400.9,862.2 L 396.7,881.1 L 367.4,892.7 L 338.7,864.3 L 330.5,861.6 L 293.2,869.1 Z", label: [694.2, 714.2] },
};

// Grouping for the "Localități limitrofe" chip list — items with a real shape are
// drawn from AREA_PATHS above; Roșu and Militari Residence get a hand-placed point
// near Chiajna since they aren't independent administrative units.
const ZONE_SUBURBS = [
  { id: "voluntari", name: "Voluntari" },
  { id: "chiajna", name: "Chiajna" },
  { id: "militari-residence", name: "Militari Residence", x: -615, y: -88 },
  { id: "rosu", name: "Roșu", x: -815, y: 55 },
  { id: "domnesti", name: "Domnești" },
  { id: "clinceni", name: "Clinceni" },
  { id: "bragadiru", name: "Bragadiru" },
  { id: "cornetu", name: "Cornetu" },
  { id: "magurele", name: "Măgurele" },
  { id: "popesti-leordeni", name: "Popești-Leordeni" },
];

const ZONE_ALL = [...ZONE_SECTORS, ...ZONE_NEIGHBORHOODS, ...ZONE_SUBURBS];

function ZoneMarker({ id, name, x, y, isActive, onSelect }) {
  return (
    <g onClick={() => onSelect(id)} style={{ cursor: "pointer" }}>
      <circle cx={x} cy={y} r={isActive ? 16 : 10}
        fill={isActive ? "#ea580c" : "white"} stroke={isActive ? "#ea580c" : "#0277bd"} strokeWidth="3.5"
        style={{ transition: "all 0.2s" }} />
      {isActive && <text x={x} y={y - 24} textAnchor="middle" fontSize="30" fontWeight="700" fill="#0d1b2a" style={{ pointerEvents: "none" }}>{name}</text>}
    </g>
  );
}

function ZoneArea({ id, name, path, label, isActive, onSelect }) {
  return (
    <g onClick={() => onSelect(id)} style={{ cursor: "pointer" }}>
      <path d={path} fill={isActive ? "#ea580c" : "#f8fafc"} stroke={isActive ? "#ea580c" : "#94a3b8"} strokeWidth="3" style={{ transition: "all 0.2s" }} />
      <text x={label[0]} y={label[1]} textAnchor="middle" dominantBaseline="middle" fontSize={isActive ? 20 : 15}
        fontWeight="700" fill={isActive ? "white" : "#64748b"} style={{ pointerEvents: "none" }}>{name}</text>
    </g>
  );
}

function InteractiveZoneMap({ highlighted, onSelect }) {
  const activeNeighborhood = ZONE_NEIGHBORHOODS.find(n => n.id === highlighted);
  const activeSectorNum = highlighted?.startsWith("sector-")
    ? Number(highlighted.split("-")[1])
    : activeNeighborhood?.sector;

  return (
    <svg viewBox="-1615 -1526 2858 2823" style={{ width: "100%", height: "auto", maxWidth: "900px", display: "block", margin: "0 auto" }}>
      <rect x="-1615" y="-1526" width="2858" height="2823" fill="white" />
      {ZONE_SECTORS.map(s => {
        const n = Number(s.id.split("-")[1]);
        const [lx, ly] = SECTOR_LABEL_POS[n];
        const isActive = highlighted === s.id;
        const isParent = !isActive && activeSectorNum === n;
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
            <path d={SECTOR_PATHS[n]}
              fill={isActive ? "#0277bd" : isParent ? "#bfe3fb" : "#eef4fb"}
              stroke="#cbd5e1" strokeWidth="4" style={{ transition: "fill 0.25s" }} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize="46" fontWeight="700" fill={isActive ? "white" : "#94a3b8"} style={{ pointerEvents: "none" }}>{n}</text>
          </g>
        );
      })}

      {Object.entries(AREA_PATHS).map(([id, a]) => (
        <ZoneArea key={id} id={id} name={a.name} path={a.path} label={a.label} isActive={highlighted === id} onSelect={onSelect} />
      ))}

      {ZONE_NEIGHBORHOODS.map(nb => (
        AREA_PATHS[nb.id] ? null : (
          <ZoneMarker key={nb.id} id={nb.id} name={nb.name} x={nb.x} y={nb.y} isActive={highlighted === nb.id} onSelect={onSelect} />
        )
      ))}

      {ZONE_SUBURBS.map(sb => (
        AREA_PATHS[sb.id] ? null : (
          <ZoneMarker key={sb.id} id={sb.id} name={sb.name} x={sb.x} y={sb.y} isActive={highlighted === sb.id} onSelect={onSelect} />
        )
      ))}
    </svg>
  );
}

// Simple generic fridge illustration (no stock photo, no competing brand logos) —
// the brand name renders as a turquoise "nameplate" directly on the door, like a real appliance badge.
function FridgeIllustration({ brand }) {
  const fontSize = brand.length > 14 ? 15 : brand.length > 9 ? 19 : 24;
  return (
    <svg viewBox="0 0 240 340" style={{ width: "100%", maxWidth: "220px", display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="fridgeBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9eef4" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="330" rx="88" ry="9" fill="rgba(15,23,42,0.08)" />
      <rect x="20" y="10" width="200" height="312" rx="26" fill="url(#fridgeBody)" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M 34 10 L 34 60" stroke="rgba(255,255,255,0.7)" strokeWidth="10" strokeLinecap="round" />
      <line x1="24" y1="104" x2="216" y2="104" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <rect x="192" y="34" width="11" height="46" rx="5.5" fill="#94a3b8" />
      <rect x="192" y="140" width="11" height="120" rx="5.5" fill="#94a3b8" />
      <text x="118" y="200" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Poppins', sans-serif" fontWeight="700" letterSpacing="1.5"
        fontSize={fontSize} fill="#0d9488" style={{ textTransform: "uppercase" }}>
        {brand}
      </text>
    </svg>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? "star" : "star empty"}>★</span>
      ))}
    </span>
  );
}

function CategoryBadge({ cat }) {
  const colors = {
    "Sfaturi": { bg: "#e0f2fe", color: "#0277bd" },
    "No-Frost": { bg: "#f0fdf4", color: "#16a34a" },
    "Urgențe": { bg: "#fef2f2", color: "#dc2626" },
    "Întreținere": { bg: "#faf5ff", color: "#7c3aed" },
    "General": { bg: "#f1f5f9", color: "#475569" },
  };
  const c = colors[cat] || colors["General"];
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {cat}
    </span>
  );
}

// Reaction button: like / love / dislike
function ReactionBtn({ type, count, active, onClick, size = "md" }) {
  const icons = { like: <FaThumbsUp />, love: <FaHeart />, dislike: <FaThumbsDown /> };
  const labels = { like: "👍", love: "❤️", dislike: "👎" };
  const colors = { like: "#0277bd", love: "#e91e63", dislike: "#ef4444" };
  const isSmall = size === "sm";
  return (
    <button
      onClick={onClick}
      title={type === "love" ? "Articolul mi-a fost util" : type}
      style={{
        display: "inline-flex", alignItems: "center", gap: isSmall ? "3px" : "5px",
        background: active ? (type === "like" ? "#e3f2fd" : type === "love" ? "#fce4ec" : "#fee2e2") : "#f8faff",
        color: active ? colors[type] : "#94a3b8",
        border: `1.5px solid ${active ? colors[type] : "#e2e8f0"}`,
        borderRadius: "20px",
        padding: isSmall ? "3px 8px" : "5px 12px",
        cursor: "pointer",
        fontSize: isSmall ? "12px" : "13px",
        fontWeight: "600",
        fontFamily: "inherit",
        transition: "all 0.15s",
        userSelect: "none",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = colors[type]; e.currentTarget.style.color = colors[type]; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; } }}
    >
      {React.cloneElement(icons[type], { size: isSmall ? 10 : 12 })} {count > 0 ? count : ""}
    </button>
  );
}

// ===== MAIN COMPONENT =====

export default function App() {
  const [lang, setLang] = useState("ro");
  const [activeNav, setActiveNav] = useState("acasa");
  const [selectedBrand, setSelectedBrand] = useState("Bosch");
  const [highlightedZone, setHighlightedZone] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [submissionAlert, setSubmissionAlert] = useState(null);

  // Gallery
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState(GALLERY);
  const galleryTimer = useRef(null);

  // Admin
  const [adminToken, setAdminToken] = useState(null);
  const isAdmin = adminToken !== null;
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  // Blog
  const [posts, setPosts] = useState([]);
  const [activeBlogPost, setActiveBlogPost] = useState(null);
  const [postComments, setPostComments] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [commentUsername, setCommentUsername] = useState("");
  const [commentText, setCommentText] = useState("");
  const [postsVisible, setPostsVisible] = useState(6);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reviewsVisible, setReviewsVisible] = useState(5);
  const [commentsVisible, setCommentsVisible] = useState(5);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({ title: "", excerpt: "", content: "", category: "General", image_url: "" });
  const [uploading, setUploading] = useState(false);

  // Reactions
  const [postReactions, setPostReactions] = useState({});     // { postId: { like, love, dislike, mine } }
  const [commentReactions, setCommentReactions] = useState({}); // { commentId: { ... } }
  const sessionId = useRef(null);

  // FAQ
  const [openFaq, setOpenFaq] = useState(null);

  // Session ID
  useEffect(() => {
    let sid = localStorage.getItem("frigSessionId");
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("frigSessionId", sid); }
    sessionId.current = sid;
  }, []);

  // Scroll handler
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Document title
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "ro"
      ? "Reparații Frigidere București | Opris Adrian PFA | +40 737 444 337"
      : "Fridge Repair Bucharest | Opris Adrian PFA | +40 737 444 337";
  }, [lang]);

  // FAQPage structured data — generated from the live FAQ content so it can't drift out of sync
  useEffect(() => {
    const items = t.faq.items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    }));
    let script = document.getElementById("faq-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "faq-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items });
  }, [lang]);

  // Boot fetch
  useEffect(() => {
    fetch("/api/health").catch(() => {});
    fetch("/api/posts").then(r => r.json()).then(d => Array.isArray(d) && setPosts(d)).catch(() => {});
  }, []);

  // Admin token restore
  useEffect(() => {
    const saved = localStorage.getItem("fridgeAdminToken");
    if (!saved) return;
    fetch("/api/admin/verify", { headers: { Authorization: `Bearer ${saved}` } })
      .then(r => r.json())
      .then(d => { if (d.valid) setAdminToken(saved); else localStorage.removeItem("fridgeAdminToken"); })
      .catch(() => localStorage.removeItem("fridgeAdminToken"));
  }, []);

  // Gallery auto-advance
  const advanceGallery = useCallback(() => {
    setGalleryIndex(i => (i + 1) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    galleryTimer.current = setInterval(advanceGallery, 4500);
    return () => clearInterval(galleryTimer.current);
  }, [advanceGallery]);

  const gallerNav = (dir) => {
    clearInterval(galleryTimer.current);
    setGalleryIndex(i => (i + dir + galleryImages.length) % galleryImages.length);
    galleryTimer.current = setInterval(advanceGallery, 4500);
  };

  // ===== HELPERS =====

  const showToast = (msg) => {
    const id = Date.now();
    setToast({ id, message: msg });
    setTimeout(() => setToast(t => t?.id === id ? null : t), 5000);
  };

  const showAlert = (msg) => {
    setSubmissionAlert(msg);
    setTimeout(() => setSubmissionAlert(null), 15000);
  };

  const authHeader = () => ({ Authorization: `Bearer ${adminToken}` });

  // ===== ADMIN =====

  const handleAdminLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: adminPassword }) });
      const data = await res.json();
      if (res.ok) {
        setAdminToken(data.token);
        localStorage.setItem("fridgeAdminToken", data.token);
        setShowAdminLogin(false); setAdminPassword(""); setAdminError("");
        showToast("Autentificat ca admin!");
      } else { setAdminError(data.error || "Parolă incorectă"); }
    } catch { setAdminError("Eroare de conexiune"); }
  };

  const handleAdminLogout = () => { setAdminToken(null); localStorage.removeItem("fridgeAdminToken"); };

  // ===== REACTIONS =====

  const loadPostReactions = async (postId) => {
    try {
      const sid = sessionId.current || "";
      const res = await fetch(`/api/posts/${postId}/reactions?session=${sid}`);
      const data = await res.json();
      setPostReactions(prev => ({ ...prev, [postId]: data }));
    } catch (_) {}
  };

  const loadCommentReactions = async (comments) => {
    if (!comments || !comments.length) return;
    const sid = sessionId.current || "";
    await Promise.all(
      comments.map(async (c) => {
        try {
          const res = await fetch(`/api/comments/${c.id}/reactions?session=${sid}`);
          const data = await res.json();
          setCommentReactions(prev => ({ ...prev, [c.id]: data }));
        } catch (_) {}
      })
    );
  };

  const handlePostReaction = async (postId, type) => {
    const sid = sessionId.current;
    if (!sid) return;
    const current = postReactions[postId] || { like: 0, love: 0, dislike: 0, mine: null };
    const isSame = current.mine === type;
    // Optimistic update
    const next = { ...current, mine: isSame ? null : type };
    if (!isSame) next[type] = (current[type] || 0) + 1;
    if (current.mine && !isSame) next[current.mine] = Math.max(0, (current[current.mine] || 0) - 1);
    if (isSame) next[type] = Math.max(0, (current[type] || 0) - 1);
    setPostReactions(prev => ({ ...prev, [postId]: next }));
    try {
      if (isSame) {
        await fetch(`/api/posts/${postId}/reactions`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid }) });
      } else {
        await fetch(`/api/posts/${postId}/reactions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid, type }) });
      }
    } catch (_) { loadPostReactions(postId); }
  };

  const handleCommentReaction = async (commentId, type) => {
    const sid = sessionId.current;
    if (!sid) return;
    const current = commentReactions[commentId] || { like: 0, love: 0, dislike: 0, mine: null };
    const isSame = current.mine === type;
    const next = { ...current, mine: isSame ? null : type };
    if (!isSame) next[type] = (current[type] || 0) + 1;
    if (current.mine && !isSame) next[current.mine] = Math.max(0, (current[current.mine] || 0) - 1);
    if (isSame) next[type] = Math.max(0, (current[type] || 0) - 1);
    setCommentReactions(prev => ({ ...prev, [commentId]: next }));
    try {
      if (isSame) {
        await fetch(`/api/comments/${commentId}/reactions`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid }) });
      } else {
        await fetch(`/api/comments/${commentId}/reactions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid, type }) });
      }
    } catch (_) {}
  };

  // ===== BLOG =====

  const loadPostComments = async (postId) => {
    try {
      const headers = isAdmin ? authHeader() : {};
      const res = await fetch(`/api/posts/${postId}/comments`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPostComments(prev => ({ ...prev, [postId]: data }));
        loadCommentReactions(data);
      }
    } catch (_) {}
  };

  const openPost = (post) => {
    setActiveBlogPost(post);
    setReplyTo(null); setCommentText(""); setCommentUsername(""); setCommentsVisible(5);
    if (post.content === undefined) {
      fetch(`/api/posts/${post.id}`, { headers: isAdmin ? authHeader() : {} })
        .then(r => r.ok ? r.json() : null)
        .then(full => { if (full) setActiveBlogPost(prev => (prev && prev.id === full.id ? full : prev)); })
        .catch(() => {});
    }
    if (!postComments[post.id]) loadPostComments(post.id);
    loadPostReactions(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!commentUsername.trim()) { showToast(lang === "ro" ? "Numele este obligatoriu" : "Name is required"); return; }
    try {
      const res = await fetch(`/api/posts/${activeBlogPost.id}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: commentUsername, text: commentText, parent_id: replyTo }),
      });
      if (res.ok) {
        await loadPostComments(activeBlogPost.id);
        setCommentText(""); setCommentUsername(""); setReplyTo(null);
        showAlert(lang === "ro"
          ? "Comentariu trimis. Acesta va fi publicat după ce va fi aprobat de către administrator."
          : "Comment submitted. It will be published after being approved by the administrator.");
        return;
      }
    } catch (_) {}
    showToast(lang === "ro" ? "Eroare la trimitere." : "Submission error.");
  };

  const approveComment = async (postId, commentId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}/approve`, { method: "PATCH", headers: authHeader() });
      if (res.status === 401) { handleAdminLogout(); return; }
      if (res.ok) { await loadPostComments(postId); showToast(lang === "ro" ? "Comentariu aprobat!" : "Comment approved!"); }
    } catch (_) {}
  };

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("Ștergi comentariul?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: "DELETE", headers: authHeader() });
      if (res.status === 401) { handleAdminLogout(); return; }
      if (res.ok) { await loadPostComments(postId); showToast(lang === "ro" ? "Comentariu șters!" : "Comment deleted!"); }
    } catch (_) {}
  };

  const handleSavePost = async () => {
    if (!postForm.title || !postForm.content) { showToast("Titlul și conținutul sunt obligatorii."); return; }
    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
      const method = editingPost ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify(postForm) });
      if (res.ok) {
        const updated = await res.json();
        setPosts(prev => editingPost ? prev.map(p => p.id === updated.id ? updated : p) : [updated, ...prev]);
        setShowNewPostForm(false); setEditingPost(null);
        setPostForm({ title: "", excerpt: "", content: "", category: "General", image_url: "" });
        const translated = !!updated.title_en;
        const base = editingPost ? "Articol actualizat!" : "Articol creat!";
        showToast(translated ? `${base} Tradus automat în engleză.` : `${base} (traducere automată indisponibilă — verifică DEEPL_API_KEY)`);
      }
    } catch (_) { showToast("Eroare la salvare."); }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(',')[1];
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ filename: file.name, type: file.type, data: base64 }),
      });
      if (res.ok) {
        const { url } = await res.json();
        setPostForm(p => ({ ...p, image_url: url }));
        showToast("Imagine încărcată!");
      } else { showToast("Eroare la încărcare."); }
    } catch (_) { showToast("Eroare la încărcare."); }
    setUploading(false);
  };

  const handleTogglePublish = async (post) => {
    try {
      const res = await fetch(`/api/posts/${post.id}/publish`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify({ published: !post.published }) });
      if (res.ok) {
        const updated = await res.json();
        setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
        if (activeBlogPost?.id === updated.id) setActiveBlogPost(updated);
        showToast(updated.published ? "Articol publicat!" : "Articol ascuns!");
      }
    } catch (_) {}
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Ștergi articolul definitiv?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE", headers: authHeader() });
      if (res.ok) { setPosts(prev => prev.filter(p => p.id !== postId)); if (activeBlogPost?.id === postId) setActiveBlogPost(null); showToast("Articol șters!"); }
    } catch (_) {}
  };

  // ===== TRANSLATIONS =====

  const t = {
    ro: {
      nav: { acasa: "Acasă", despre: "Despre mine", servicii: "Servicii", galerie: "Galerie", zone: "Zone", blog: "Blog", recenzii: "Recenzii", contact: "Contact" },
      hero: {
        badge: "Autorizat AGFR • 16+ ani experiență",
        h1: "Frigiderul s-a defectat?",
        h1b: "Îl reparăm la domiciliul tău.",
        sub: "Tehnician frigotehnist autorizat certificat pentru frigidere, combine frigorifice și congelatoare. Intervenție rapidă în București și împrejurimi.",
        cta1: "Sună Acum",
        badges: ["Garanție 12 luni", "Factură fiscală", "Piese originale", "Deplasare 70 lei"],
      },
      about: {
        title: "Despre mine", sub: "16+ ani de reparații frigidere în București, 1000+ de clienți mulțumiți",
        facts: [
          { label: "Experiență", value: "16+ ani" },
          { label: "Autorizare", value: "AGFR — freon" },
          { label: "PFA", value: "CUI 26374475 / 07.01.2010" },
          { label: "Intervenții efectuate", value: "1000+" },
        ],
        paragraphs: [
          "Numele meu este Adrian Opriș și sunt tehnician calificat, autorizat frigotehnist și electronist automatizări, având experiența de peste 16 ani. Efectuez reparații frigidere și combine frigorifice în zona Capitalei ca independent, înregistrat oficial CUI 26374475 / 07.01.2010, autorizat AGFR pentru utilizarea și încărcarea cu freon a instalațiilor frigorifice. Vă stau la dispoziție pentru a vă oferi servicii de reparații frigidere de calitate, la domiciliu, în caz de urgență.",
          "Nu reprezint service de reprezentanță și efectuez rapid reparații cu piese originale, în mod profesionist, oferind o garanție de 12 luni cu factură fiscală.",
          "Asigur intervenții prompte de: încărcare cu freon, înlocuire compresor, înlocuire termostat, senzori de temperatură, schimbare ventilatoare, reparații placă electronică la frigidere și alte intervenții, la prețuri avantajoase.",
          "Pentru o informare cât mai apropiată de posibila cauză a defectului, vă rog frumos, pentru a veni pregătit cu piese potrivite și a vă executa reparația frigiderului cât mai rapid, să vă aflați în apropierea frigiderului în momentul discuției telefonice, pentru a vă putea pune câteva scurte întrebări legate de funcționalitatea lui. De asemenea, m-ar ajuta și poze cu frigiderul sau combina frigorifică în cauză, pentru a-mi face o idee cât mai clară despre natura problemei tehnice apărute. Pe baza discuției telefonice, dacă vă pot ajuta cu reparația frigiderului, vom stabili de comun acord o vizită pentru o constatare și eventuala reparație la domiciliul dumneavoastră.",
          "Folosesc scule specifice domeniului frigotehnic, de calitate, care au cele mai bune evaluări, iar în cadrul reparației frigiderului folosesc piese originale de calitate, cu garanție, oferind garanție pentru reparația frigiderului efectuată și piesa înlocuită.",
          "Mentenanța frigiderelor casnice, efectuată de un frigotehnist autorizat, chiar dacă nu este obligatorie prin lege, este necesară după 3-4 ani de folosire. Consider importantă și punerea în funcțiune, inclusiv reglarea setărilor frigiderului în funcție de locație și modul de amplasare. Efectuate corect, acestea ar ajuta mult utilizatorii să se poată bucura cât mai mult de combina frigorifică sau frigider, evitând defecțiunile premature.",
          "De asemenea, pot efectua revizii profesionale periodice la frigidere și combine frigorifice. Pentru orice problemă legată de service la frigiderul dumneavoastră, vă stau la dispoziție cu profesionalismul și experiența îndelungată acumulată în cele peste 1000 de intervenții efectuate.",
        ],
      },
      gallery: { title: "Galerie Foto", sub: "Lucrări realizate — reparații frigidere la domiciliu în București" },
      services: {
        title: "Servicii și Tarife", sub: "Prețuri transparente, fără surprize",
        callout: "Deplasare la domiciliu + diagnosticare:", calloutPrice: "70 lei",
        items: [
          { icon: <FaSnowflake />, name: "Încărcare freon frigider", price: "200 – 250 lei" },
          { icon: <FaThermometerHalf />, name: "Schimb termostat", price: "200 – 250 lei" },
          { icon: <FaTools />, name: "Reparație sistem frigorific + filtru + freon", price: "350 – 450 lei" },
          { icon: <FaBolt />, name: "Schimb releu de pornire", price: "200 lei" },
          { icon: <FaWind />, name: "Schimb motor ventilator (no-frost)", price: "250 – 300 lei" },
          { icon: <FaMicrochip />, name: "Reparație placă electronică de bază", price: "300 lei" },
          { icon: <FaThermometerHalf />, name: "Schimb senzori temperatură", price: "250 – 350 lei" },
          { icon: <FaTools />, name: "Schimb compresor + freon", price: "800 – 850 lei" },
        ],
        note: "* Prețurile pot varia în funcție de modelul aparatului și piesele necesare. Diagnosticul final se stabilește după inspecție la fața locului.",
      },
      process: {
        title: "Cum funcționează", sub: "Rapid, profesional, fără bătăi de cap",
        steps: [
          { n: "1", title: "Suni sau trimiți WhatsApp", desc: "Descrii problema și stabilim împreună o oră convenabilă.", phone: "0737 444 337" },
          { n: "2", title: "Venim la tine acasă", desc: "Tehnicianul ajunge la adresa ta în intervalul orar stabilit, cu unelte și piese de schimb." },
          { n: "3", title: "Diagnosticăm gratuit*", desc: "Identificăm defecțiunea și îți comunicăm costul exact înainte de a începe reparația." },
          { n: "4", title: "Reparăm pe loc", desc: "Majoritatea intervențiilor se rezolvă la prima vizită, cu piese originale și garantate." },
          { n: "5", title: "12 luni garanție", desc: "Fiecare reparație vine cu garanție de 12 luni și factură fiscală." },
        ],
        note: "* Diagnosticarea este inclusă în tariful de deplasare de 70 lei.",
      },
      brands: { title: "Mărci deservite", sub: "Reparăm toate brandurile importante de frigidere" },
      zones: {
        title: "Zone de intervenție în București", sub: "Acoperim toată capitala și împrejurimile",
        sectors: "Toate sectoarele",
        sectorsDesc: "Intervenim în toate cele 6 sectoare ale Bucureștiului: Sector 1 (Floreasca, Dorobanți, Aviației), Sector 2 (Obor, Iancului, Pantelimon), Sector 3 (Titan, Vitan, Dristor), Sector 4 (Berceni, Văcărești, Tineretului), Sector 5 (Rahova, Ferentari) și Sector 6 (Militari, Drumul Taberei, Crângași).",
        neighborhoods: "Cartiere principale",
        neighborhoodsDesc: "Militari, Drumul Taberei, Titan, Berceni, Pantelimon, Colentina, Floreasca, Dorobanți, Aviației, Pipera, Rahova, Ferentari, Giulești, Crângași, Văcărești, Tineretului, Dristor, Vitan, Iancului, Obor, Grivița, Băneasa, Otopeni.",
        suburbs: "Localități limitrofe",
        suburbsDesc: "Bragadiru, Domnești, Clinceni, Măgurele, Militari Residence, Chiajna, Roșu, Cornetu, Popești-Leordeni, Voluntari.",
        seoText: "Serviciile noastre de reparații frigidere acoperă întreaga arie metropolitană a Bucureștiului. Indiferent dacă locuiești în sectorul 1, 2, 3, 4, 5 sau 6, sau în localitățile limitrofe, tehnicianul nostru autorizat ajunge la tine rapid.",
      },
      reviews: {
        title: "Ce spun clienții", sub: "16+ ani de reparații a frigiderelor în București, 1000+ de clienți mulțumiți, 700+ review-uri pe Google Maps",
        mapTitle: "Locația noastră",
        loadMore: "Mai multe recenzii", loadLess: "Mai puține recenzii",
        items: [
          { name: "Andreea Popa", zone: "Rahova, Sector 5", rating: 5, text: "Combina frigorifică Electrolux a înghețat brusc pe o parte. L-am sunat pe Opriș Adrian dimineața, a venit la prânz, a identificat rapid un senzor de temperatură defect și l-a înlocuit pe loc. Foarte mulțumită de rapiditate și profesionalism.", date: "2026" },
          { name: "Mara Ionescu", zone: "Obor, Sector 2", rating: 5, text: "Frigiderul Samsung nu mai răcea deloc. Opriș Adrian a venit în aceeași zi, a găsit rapid problema și l-a reparat pe loc. Foarte mulțumită de seriozitate și preț corect.", date: "2025" },
          { name: "Radu Constantinescu", zone: "Titan, Sector 3", rating: 5, text: "Combina frigorifică Bosch avea o defecțiune la termostat. Diagnostic corect, piesă originală, garanție 12 luni. Recomand cu încredere.", date: "2023" },
          { name: "Elena Vasilescu", zone: "Drumul Taberei", rating: 5, text: "Pierdere de freon la frigiderul Beko, rezolvată rapid și curat. A explicat tot procesul și a lăsat factură fiscală. Al doilea an la rând când apelez la el.", date: "2021" },
          { name: "Cristian Neagu", zone: "Berceni, Sector 4", rating: 4, text: "A întârziat puțin față de ora stabilită, dar odată ajuns a reparat frigiderul Arctic rapid și profesionist. Preț corect, aș apela din nou.", date: "2019" },
          { name: "Simona Barbu", zone: "Militari", rating: 5, text: "Compresorul frigiderului Whirlpool s-a defectat brusc. A venit repede, a schimbat compresorul pe loc și a testat totul înainte să plece. Impecabil.", date: "2017" },
          { name: "Florin Matei", zone: "Floreasca, Sector 1", rating: 5, text: "Frigiderul Indesit avea probleme cu răcirea de câteva săptămâni. A identificat problema din prima vizită și a rezolvat-o cu piese de calitate.", date: "2015" },
          { name: "Ioana Dobre", zone: "Pantelimon", rating: 5, text: "Am apelat pentru un frigider Gorenje vechi care făcea zgomot ciudat. A diagnosticat corect ventilatorul defect și l-a înlocuit rapid. Foarte punctual.", date: "2013" },
          { name: "Nicolae Stanciu", zone: "Sector 6", rating: 5, text: "Unul dintre primii clienți ai lui Opriș Adrian — frigider Zanussi cu pierdere de freon. De atunci îl chem de fiecare dată când am o problemă cu electrocasnicele.", date: "2011" },
        ],
      },
      blog: {
        title: "Articole și Sfaturi", sub: "Informații utile despre îngrijirea și repararea frigiderelor",
        readMore: "Citește articolul", backToList: "← Înapoi la articole",
        comments: "Comentarii", addComment: "Adaugă un comentariu",
        namePlaceholder: "Numele tău *", commentPlaceholder: "Scrie comentariul tău...",
        submit: "Trimite", pending: "În așteptare de aprobare",
        replyTo: "Răspunde la:", cancelReply: "Anulează",
        noComments: "Fii primul care comentează!", noArticles: "Momentan nu există articole publicate.",
        loadMore: "Mai multe articole", loadLess: "Mai puține articole",
        loadMoreComments: "Mai multe comentarii", loadLessComments: "Mai puține comentarii",
        showOf: "Se afișează", of: "din", articles: "articole",
        allCategories: "Toate categoriile",
        newArticle: "Articol nou", editArticle: "Editează articolul",
        saveArticle: "Salvează", cancelEdit: "Anulează",
        titleLabel: "Titlu *", excerptLabel: "Rezumat (opțional)", contentLabel: "Conținut *",
        categoryLabel: "Categorie", imageLabel: "URL imagine", imageUpload: "Sau încarcă imagine",
        publish: "Publică", unpublish: "Ascunde", deleteArticle: "Șterge",
        approve: "Aprobă",
        reactions: { label: "A fost util?", like: "Util", love: "Excelent", dislike: "Nu m-a ajutat" },
      },
      faq: {
        title: "Întrebări frecvente", sub: "Răspunsuri la cele mai comune întrebări",
        items: [
          { q: "Cât durează o reparație de frigider?", a: "Majoritatea reparațiilor se rezolvă la prima vizită, în 1-2 ore. Dacă este necesară o piesă de schimb specială, poate dura 1-2 zile suplimentare." },
          { q: "Veniți și în weekend?", a: "Da, lucrăm de luni până sâmbătă, între orele 09:00-18:00. Pentru urgențe, încercăm să găsim soluții și în afara programului normal." },
          { q: "Ce garanție ofer pentru reparații?", a: "Toate reparațiile beneficiază de garanție 12 luni. În această perioadă, dacă apare din nou aceeași problemă, intervenim gratuit." },
          { q: "Folosiți piese originale?", a: "Da, folosim exclusiv piese originale sau echivalente de calitate superioară, cu certificat de calitate. Emit întotdeauna factură fiscală." },
          { q: "Ce mărci de frigidere reparați?", a: "Reparăm toate mărcile principale: Bosch, Samsung, Whirlpool, Electrolux, Indesit, Gorenje, Beko, Arctic, Zanussi, Grundig, Hotpoint Ariston și altele." },
          { q: "Cât costă diagnosticul?", a: "Tariful de deplasare și diagnosticare este de 70 lei. Dacă decideți să faceți reparația, această sumă se scade din costul total." },
          { q: "Merită să repar sau să cumpăr frigider nou?", a: "De regulă, reparația merită dacă costul ei este sub 50% din prețul unui frigider nou similar. Vă sfătuim onest după diagnosticare." },
          { q: "De ce frigiderul se aude funcționând, dar nu mai congelează și nici nu mai răcește?", a: "Cauza probabilă este compresia slabă a motorului sau o pierdere de freon în circuitul frigotehnic." },
          { q: "De ce se face multă gheață în frigider?", a: "Este posibil ca termostatul frigiderului sau senzorul de temperatură să fie defect. Același simptom poate fi cauzat și de o pierdere de freon prin circuitul frigotehnic din carcasa frigiderului." },
          { q: "De ce sar siguranțele când bag frigiderul în priză?", a: "Cauza este de obicei un scurtcircuit pe alimentare sau la releu, ori chiar compresorul aflat în scurtcircuit." },
          { q: "De ce se simte miros de ars în spatele frigiderului?", a: "Acest simptom este cauzat de obicei de un scurtcircuit pe alimentare sau la releul de pornire." },
          { q: "De ce funcționează frigiderul mult timp și se oprește foarte rar?", a: "Cauza posibilă poate fi uzura compresorului, setări de temperatură extreme, înghețare rapidă, pierderi de freon sau blocaje ale circuitului de aer la frigiderele No-Frost." },
          { q: "De ce curge apă din tavanul frigiderului, în interior?", a: "La frigiderele No-Frost cu congelatorul sus, acest defect este de obicei cauzat de un blocaj al evacuării apei rezultate din dezghețare, apa scurgându-se pe grila de retur aer. La frigiderele cu autodezghețare și congelator sus, poate fi vorba de o etanșare proastă a garniturii ușii." },
          { q: "De ce se aude frigiderul pornind și oprindu-se după câteva secunde?", a: "Cauza posibilă: compresorul este blocat și intră în protecție termică, sau releul de pornire este defect." },
          { q: "De ce este lumina aprinsă în frigider, dar frigiderul nu se aude funcționând?", a: "Cauza posibilă: termostatul electromecanic sau placa electronică sunt defecte. Este posibil și ca bobinele compresorului să fie în scurtcircuit." },
          { q: "De ce se aude frigiderul funcționând, dar se dezgheață?", a: "Cauza posibilă poate fi înfundarea circuitului frigotehnic, compresia slabă a motorului sau o pierdere de agent frigorific." },
          { q: "De ce nu se mai aprinde afișajul, deși lumina din interior funcționează?", a: "Cauza este de obicei o problemă la modulul electronic de comandă, posibil provocată de o fluctuație de tensiune." },
          { q: "De ce nu se mai aprinde becul și frigiderul nu pornește?", a: "Defectul poate fi cauzat de lipsa alimentării cu curent, sau becul s-a ars și frigiderul se află într-o pauză a ciclului de funcționare." },
          { q: "De ce frigiderul nu mai răcește, iar congelatorul răcește doar puțin?", a: "Cauza este de obicei pierderea de freon, înfundarea instalației sau lipsa compresiei la motor." },
          { q: "De ce frigiderul nu funcționează și nici lumina din interior nu se mai aprinde?", a: "Defectul poate consta în lipsa alimentării cu curent sau un scurtcircuit." },
          { q: "De ce răcește frigiderul o perioadă, după care se oprește și se dezgheață?", a: "Cauza este pierderea de freon sau compresia scăzută a compresorului." },
          { q: "De ce, la întoarcerea acasă, găsiți frigiderul dezghețat și apă pe jos?", a: "Defectul poate fi generat de o pierdere de agent frigorific sau de blocarea compresorului." },
          { q: "De ce se aud trosnituri sau pocnituri din frigider în timpul funcționării?", a: "Acest lucru este cauzat de obicei de procesul de dezghețare la frigiderele No-Frost, sau de contracția și dilatarea plasticului din interiorul carcasei." },
          { q: "De ce nu mai răcește frigiderul, dar congelatorul da?", a: "La frigiderele cu dezghețare automată, motivul este în general pierderea de freon — reparația constă în identificarea pierderii, remedierea ei și încărcarea cu agent frigorific. La cele No-Frost, cauza este de regulă blocarea cu gheață a circuitului de retur aer dinspre congelator spre frigider — reparația constă în dezghețare și identificarea componentelor din sistemul de degivrare care nu funcționează corespunzător, urmată de înlocuirea lor." },
          { q: "De ce se face gheață în interiorul frigiderului?", a: "Acumularea de gheață în cantități mari se face de obicei din cauza unei pierderi de freon, a compresiei scăzute a motorului, sau a defectării termostatului ori a senzorului de temperatură." },
          { q: "De ce se aude o avertizare sonoră și apare semnul de exclamare roșu pe afișaj (sau codurile A1, A2)?", a: "Această avertizare sonoră și vizuală este de obicei cauzată de temperatura ridicată din compartimentul de congelare sau răcire. După resetare dispare, dar în general reapare după circa o oră. De obicei problema este legată de funcționarea compresorului, posibil însoțită de o pierdere de freon sau de probleme la sistemul de degivrare No-Frost. Avertizarea apare și atunci când ușa este lăsată deschisă." },
          { q: "Frigiderul are lumina aprinsă, dar nu funcționează — care poate fi cauza?", a: "Este posibil să existe o problemă la termostat sau la placa electronică, de obicei pe fondul unor fluctuații de tensiune. Există și posibilitatea ca respectivul compresor să fie blocat." },
          { q: "Frigiderul nu mai răcește și se aude un susur de apă — ce înseamnă?", a: "De obicei defectul este cauzat de pierderea agentului frigorific prin carcasa frigiderului, corelată cu o supraîncălzire a compresorului care funcționează continuu." },
          { q: "De ce este apă sub sertarele pentru păstrarea legumelor?", a: "Este posibil ca traseul de evacuare a apei rezultate din autodezghețare să fie înfundat." },
          { q: "De ce se strânge gheață în partea de jos a congelatorului la frigiderele No-Frost?", a: "Poate fi o problemă la sistemul de degivrare al congelatorului, sau un blocaj mecanic al canalului de evacuare a apei rezultate din dezghețare." },
          { q: "De ce se face multă zăpadă în sertarul de sus al congelatorului, la combinele frigorifice?", a: "Este posibil să fi rămas ușa congelatorului deschisă din neatenție, sau garnitura ușii congelatorului etanșează parțial. Mai există și situația în care gheața se adună din cauza traficului frecvent la ușă, ceea ce face ca umiditatea din aer să se depună prioritar în partea de sus a congelatorului." },
        ],
      },
      contact: {
        title: "Contact", sub: "Sună acum și îți rezolvăm problema rapid",
        phone: "+40 737 444 337", phoneFull: "+40737444337",
        email: "adifrigotehnist@yahoo.com",
        address: "Bulevardul Timișoara 53, Sector 6, București",
        hours: "Luni – Sâmbătă: 09:00 – 18:00",
        legalAddress: "Sediul social: Bd. Timișoara nr. 53, sector 6, București. PFA CUI 26374475 / 07.01.2010",
        consumerProtection: "Protecția consumatorilor: INFOCONS 0219551 · site:",
        copyright: "Opris Adrian PFA • Toate drepturile rezervate.",
      },
    },
    en: {
      nav: { acasa: "Home", despre: "About Me", servicii: "Services", galerie: "Gallery", zone: "Areas", blog: "Blog", recenzii: "Reviews", contact: "Contact" },
      hero: {
        badge: "AGFR Authorized • 16+ years experience",
        h1: "Fridge broken down?", h1b: "We repair it at your home.",
        sub: "Certified, authorized fridge repair technician — fridges, fridge-freezers and freezers. Fast response in Bucharest and surrounding areas.",
        cta1: "Call Now",
        badges: ["12-month warranty", "Fiscal invoice", "Original parts", "Call-out fee 70 RON"],
      },
      about: {
        title: "About Me", sub: "16+ years of fridge repairs in Bucharest, 1000+ satisfied clients",
        facts: [
          { label: "Experience", value: "16+ years" },
          { label: "Authorization", value: "AGFR — refrigerant" },
          { label: "Sole trader (PFA)", value: "Tax ID 26374475 / 07.01.2010" },
          { label: "Interventions completed", value: "1000+" },
        ],
        paragraphs: [
          "My name is Adrian Opriș and I am a qualified, authorized refrigeration technician and automation electronics engineer, with over 16 years of experience. I carry out fridge and fridge-freezer repairs in the Bucharest area as a sole trader, officially registered under Tax ID (CUI) 26374475 / 07.01.2010, and authorized by AGFR to handle and charge refrigeration systems with refrigerant (freon). I'm at your service for quality fridge repairs at home, including emergencies.",
          "I don't represent a manufacturer's service center — I carry out fast repairs with original parts, professionally, and back every repair with a 12-month warranty and a fiscal invoice.",
          "I provide prompt interventions: refrigerant (freon) recharging, compressor replacement, thermostat replacement, temperature sensors, fan replacement, electronic board repairs for fridges, and other services at competitive prices.",
          "For information as close as possible to the likely cause of the fault — so I can come prepared with the right parts and repair your fridge as quickly as possible — please be near the fridge during our phone call, so I can ask you a few short questions about how it's behaving. Photos of the fridge or fridge-freezer in question would also help me get a clearer picture of the technical problem. Based on our phone conversation, if I can help with the repair, we'll agree together on a visit to assess the fault and carry out the repair at your home.",
          "I use quality tools specific to the refrigeration trade, with the best reviews, and for every repair I use quality original parts, with warranty, guaranteeing both the repair carried out and the part replaced.",
          "Maintenance of household fridges by an authorized refrigeration technician, while not legally required, becomes necessary after 3-4 years of use. I also consider commissioning important, including adjusting the fridge's settings according to its location and placement. Done correctly, this helps users enjoy their fridge-freezer or fridge for much longer, avoiding premature failures.",
          "I also carry out periodic professional maintenance checks on fridges and fridge-freezers. For any service issue with your fridge, I'm at your disposal with the professionalism and extensive experience built up over more than 1000 interventions carried out.",
        ],
      },
      gallery: { title: "Photo Gallery", sub: "Our work — fridge repairs at home in Bucharest" },
      services: {
        title: "Services & Pricing", sub: "Transparent pricing, no surprises",
        callout: "Home visit + fault diagnosis:", calloutPrice: "70 RON",
        items: [
          { icon: <FaSnowflake />, name: "Refrigerant (freon) recharge", price: "200 – 250 RON" },
          { icon: <FaThermometerHalf />, name: "Thermostat replacement", price: "200 – 250 RON" },
          { icon: <FaTools />, name: "Refrigeration system repair + filter + freon", price: "350 – 450 RON" },
          { icon: <FaBolt />, name: "Starting relay replacement", price: "200 RON" },
          { icon: <FaWind />, name: "Fan motor replacement (no-frost)", price: "250 – 300 RON" },
          { icon: <FaMicrochip />, name: "Main circuit board repair", price: "300 RON" },
          { icon: <FaThermometerHalf />, name: "Temperature sensors replacement", price: "250 – 350 RON" },
          { icon: <FaTools />, name: "Compressor replacement + freon", price: "800 – 850 RON" },
        ],
        note: "* Prices may vary depending on the appliance model and parts needed. The final diagnosis is established after on-site inspection.",
      },
      process: {
        title: "How It Works", sub: "Fast, professional, hassle-free",
        steps: [
          { n: "1", title: "Call or send WhatsApp", desc: "Describe the problem and we'll set a convenient time together.", phone: "0737 444 337" },
          { n: "2", title: "We come to you", desc: "The technician arrives at your address in the agreed time slot, equipped with tools and spare parts." },
          { n: "3", title: "Free diagnosis*", desc: "We identify the fault and tell you the exact cost before starting any repair." },
          { n: "4", title: "Repaired on the spot", desc: "Most repairs are completed on the first visit, using original and warranted parts." },
          { n: "5", title: "12-month warranty", desc: "Every repair comes with a 12-month warranty and a fiscal invoice." },
        ],
        note: "* Diagnosis is included in the 70 RON call-out fee.",
      },
      brands: { title: "Brands Serviced", sub: "We repair all major refrigerator brands" },
      zones: {
        title: "Service Areas in Bucharest", sub: "We cover the entire capital and surroundings",
        sectors: "All sectors",
        sectorsDesc: "We serve all 6 sectors of Bucharest: Sector 1 (Floreasca, Dorobanți, Aviației), Sector 2 (Obor, Iancului, Pantelimon), Sector 3 (Titan, Vitan, Dristor), Sector 4 (Berceni, Văcărești, Tineretului), Sector 5 (Rahova, Ferentari) and Sector 6 (Militari, Drumul Taberei, Crângași).",
        neighborhoods: "Main neighborhoods",
        neighborhoodsDesc: "Militari, Drumul Taberei, Titan, Berceni, Pantelimon, Colentina, Floreasca, Dorobanți, Aviației, Pipera, Rahova, Ferentari, Giulești, Crângași, Văcărești, Tineretului, Dristor, Vitan, Iancului, Obor, Grivița, Băneasa, Otopeni.",
        suburbs: "Surrounding areas",
        suburbsDesc: "Bragadiru, Domnești, Clinceni, Măgurele, Militari Residence, Chiajna, Roșu, Cornetu, Popești-Leordeni, Voluntari.",
        seoText: "Our fridge repair services cover the entire Bucharest metropolitan area. Whether you live in sector 1, 2, 3, 4, 5, or 6, or in the surrounding towns, our authorized technician reaches you quickly.",
      },
      reviews: {
        title: "What Clients Say", sub: "16+ years of fridge repairs in Bucharest, 1000+ satisfied clients, 700+ reviews on Google Maps",
        mapTitle: "Our Location",
        loadMore: "More reviews", loadLess: "Fewer reviews",
        items: [
          { name: "Andreea Popa", zone: "Rahova, Sector 5", rating: 5, text: "Our Electrolux fridge-freezer suddenly froze up on one side. I called Adrian in the morning, he came by noon, quickly found a faulty temperature sensor and replaced it on the spot. Very happy with how fast and professional he was.", date: "2026" },
          { name: "Mara Ionescu", zone: "Obor, Sector 2", rating: 5, text: "The Samsung fridge wasn't cooling at all. Adrian came the same day, quickly found the problem and fixed it on the spot. Very happy with his reliability and fair price.", date: "2025" },
          { name: "Radu Constantinescu", zone: "Titan, Sector 3", rating: 5, text: "The Bosch fridge-freezer had a faulty thermostat. Accurate diagnosis, original part, 12-month warranty. Highly recommend.", date: "2023" },
          { name: "Elena Vasilescu", zone: "Drumul Taberei", rating: 5, text: "Freon leak on our Beko fridge, fixed quickly and cleanly. He explained the whole process and gave us a fiscal invoice. Second year in a row I've called him.", date: "2021" },
          { name: "Cristian Neagu", zone: "Berceni, Sector 4", rating: 4, text: "He was a bit late for the agreed time, but once here he fixed the Arctic fridge quickly and professionally. Fair price, would call again.", date: "2019" },
          { name: "Simona Barbu", zone: "Militari", rating: 5, text: "The compressor on our Whirlpool fridge suddenly failed. He came quickly, replaced the compressor on the spot and tested everything before leaving. Flawless.", date: "2017" },
          { name: "Florin Matei", zone: "Floreasca, Sector 1", rating: 5, text: "Our Indesit fridge had cooling issues for weeks. He identified the problem on the first visit and fixed it with quality parts.", date: "2015" },
          { name: "Ioana Dobre", zone: "Pantelimon", rating: 5, text: "Called about an old Gorenje fridge making a strange noise. He correctly diagnosed a faulty fan motor and replaced it quickly. Very punctual.", date: "2013" },
          { name: "Nicolae Stanciu", zone: "Sector 6", rating: 5, text: "One of Adrian's earliest clients — a Zanussi fridge with a freon leak. I've called him for every appliance problem ever since.", date: "2011" },
        ],
      },
      blog: {
        title: "Articles & Tips", sub: "Useful information about fridge care and repair",
        readMore: "Read article", backToList: "← Back to articles",
        comments: "Comments", addComment: "Add a comment",
        namePlaceholder: "Your name *", commentPlaceholder: "Write your comment...",
        submit: "Submit", pending: "Pending approval",
        replyTo: "Replying to:", cancelReply: "Cancel",
        noComments: "Be the first to comment!", noArticles: "No published articles yet.",
        loadMore: "More articles", loadLess: "Fewer articles",
        loadMoreComments: "More comments", loadLessComments: "Fewer comments",
        showOf: "Showing", of: "of", articles: "articles",
        allCategories: "All categories",
        newArticle: "New article", editArticle: "Edit article",
        saveArticle: "Save", cancelEdit: "Cancel",
        titleLabel: "Title *", excerptLabel: "Excerpt (optional)", contentLabel: "Content *",
        categoryLabel: "Category", imageLabel: "Image URL", imageUpload: "Or upload image",
        publish: "Publish", unpublish: "Unpublish", deleteArticle: "Delete",
        approve: "Approve",
        reactions: { label: "Was this helpful?", like: "Helpful", love: "Excellent", dislike: "Not helpful" },
      },
      faq: {
        title: "Frequently Asked Questions", sub: "Answers to the most common questions",
        items: [
          { q: "How long does a fridge repair take?", a: "Most repairs are completed on the first visit, in 1-2 hours. If a special spare part is needed, it may take an additional 1-2 days." },
          { q: "Do you work on weekends?", a: "Yes, we work Monday to Saturday, 09:00-18:00. For emergencies, we try to find solutions outside normal hours too." },
          { q: "What warranty do you offer?", a: "All repairs come with a 12-month warranty. If the same problem recurs within this period, we intervene free of charge." },
          { q: "Do you use original parts?", a: "Yes, we use only original parts or high-quality equivalents with quality certification. We always issue a fiscal invoice." },
          { q: "Which fridge brands do you repair?", a: "We repair all major brands: Bosch, Samsung, Whirlpool, Electrolux, Indesit, Gorenje, Beko, Arctic, Zanussi, Grundig, Hotpoint Ariston and others." },
          { q: "How much does the diagnosis cost?", a: "The call-out and diagnosis fee is 70 RON. If you proceed with the repair, this amount is deducted from the total cost." },
          { q: "Is it worth repairing or buying a new fridge?", a: "Generally, repair is worthwhile if the cost is under 50% of the price of a similar new fridge. We advise you honestly after the diagnosis." },
          { q: "Why does the fridge sound like it's running but it no longer freezes or cools?", a: "The likely cause is weak compressor compression or a refrigerant (freon) leak in the cooling circuit." },
          { q: "Why does a lot of ice build up inside the fridge?", a: "The fridge's thermostat or temperature sensor may be faulty. The same symptom can also be caused by a refrigerant leak in the cooling circuit inside the fridge casing." },
          { q: "Why do the fuses trip when I plug in the fridge?", a: "This is usually caused by a short circuit in the power supply or the starting relay, or even a short-circuited compressor." },
          { q: "Why is there a burning smell behind the fridge?", a: "This is usually caused by a short circuit in the power supply or the starting relay." },
          { q: "Why does the fridge run almost non-stop and rarely switch off?", a: "This can be caused by a worn compressor, extreme temperature settings, rapid freezing, refrigerant leaks, or a blocked air circuit on No-Frost fridges." },
          { q: "Why does water drip from the top of the fridge on the inside?", a: "On No-Frost fridges with the freezer on top, this is usually caused by a blocked defrost-water drain, with water running down onto the air-return grille. On auto-defrost fridges with the freezer on top, it may be a poorly sealed door gasket." },
          { q: "Why does the fridge start up and then shut off again after a few seconds?", a: "The likely cause: the compressor is seized and trips its thermal protection, or the starting relay is faulty." },
          { q: "Why is the fridge light on but the fridge doesn't seem to be running?", a: "The likely cause: the electromechanical thermostat or the electronic board is faulty. It's also possible the compressor windings are short-circuited." },
          { q: "Why does the fridge sound like it's running but the contents defrost anyway?", a: "This can be caused by a clogged cooling circuit, weak compressor compression, or a refrigerant leak." },
          { q: "Why did the display stop lighting up, even though the interior light still works?", a: "This is usually caused by a problem with the electronic control module, possibly triggered by a voltage fluctuation." },
          { q: "Why did the bulb stop working and the fridge won't start?", a: "This can be caused by no power reaching the fridge, or the bulb has simply burned out while the fridge is between cooling cycles." },
          { q: "Why isn't the fridge compartment cooling, while the freezer only cools a little?", a: "This is usually caused by a refrigerant leak, a clogged system, or insufficient compressor compression." },
          { q: "Why doesn't the fridge work at all, with no interior light either?", a: "This can be caused by no power reaching the unit, or a short circuit." },
          { q: "Why does the fridge cool for a while, then stop and defrost?", a: "This is caused by a refrigerant leak or low compressor compression." },
          { q: "Why do you come home to find the fridge defrosted with water on the floor?", a: "This can be caused by a refrigerant leak or a seized compressor." },
          { q: "Why do I hear cracking or popping sounds from the fridge while it's running?", a: "This is usually caused by the defrost cycle on No-Frost fridges, or by the plastic inside the casing contracting and expanding with temperature." },
          { q: "Why has the fridge compartment stopped cooling while the freezer still works?", a: "On auto-defrost fridges, this is generally a refrigerant leak — the repair involves finding the leak, fixing it, and recharging the refrigerant. On No-Frost models, it's usually caused by the air-return circuit from the freezer to the fridge being blocked with ice — the repair involves defrosting the unit and identifying and replacing the faulty defrost-system components." },
          { q: "Why does ice build up inside the fridge compartment?", a: "Large ice buildup is usually caused by a refrigerant leak, low compressor compression, or a faulty thermostat or temperature sensor." },
          { q: "Why does the fridge beep with a red exclamation mark on the display (or codes A1, A2)?", a: "This sound and visual warning is usually caused by high temperature in the freezer or fridge compartment. It disappears after a reset but typically reappears within about an hour. The problem is usually related to the compressor, possibly combined with a refrigerant leak or a faulty No-Frost defrost system. The same warning also appears when the door is left open." },
          { q: "The fridge light is on but it's not running — what could be the cause?", a: "There may be a problem with the thermostat or the electronic board, usually caused by voltage fluctuations. It's also possible the compressor is seized." },
          { q: "The fridge has stopped cooling and I hear a water-trickling sound — what does that mean?", a: "This is usually caused by a refrigerant leak through the fridge casing, combined with the compressor overheating from running continuously." },
          { q: "Why is there water under the vegetable drawers?", a: "The auto-defrost water drain channel is likely blocked." },
          { q: "Why does ice collect at the bottom of the freezer on No-Frost fridges?", a: "This can be a problem with the freezer's defrost system, or a mechanical blockage in the defrost-water drain channel." },
          { q: "Why does a lot of frost build up in the top freezer drawer on fridge-freezers?", a: "The freezer door may have been left ajar by accident, or the door gasket may be sealing only partially. Frequent opening of the door can also cause this, as moisture from the air settles preferentially in the top of the freezer." },
        ],
      },
      contact: {
        title: "Contact", sub: "Call now and we'll fix your problem fast",
        phone: "+40 737 444 337", phoneFull: "+40737444337",
        email: "adifrigotehnist@yahoo.com",
        address: "Bulevardul Timișoara 53, Sector 6, Bucharest",
        hours: "Monday – Saturday: 09:00 – 18:00",
        legalAddress: "Registered office: Bd. Timișoara no. 53, district 6, Bucharest. Sole proprietorship (PFA), Tax ID (CUI) 26374475 / 07.01.2010",
        consumerProtection: "Consumer protection: INFOCONS 0219551 · site:",
        copyright: "Opris Adrian PFA • All rights reserved.",
      },
    },
  }[lang];

  const BRANDS = ["Bosch", "Samsung", "Whirlpool", "Electrolux", "Indesit", "Gorenje", "Beko", "Arctic", "Zanussi", "Grundig", "Hotpoint Ariston", "LG"];
  const brandRepairText = (brand) => lang === "ro"
    ? `Reparăm frigidere și combine frigorifice ${brand} la domiciliul tău, în București și împrejurimi. Diagnosticăm rapid defecțiunea, folosim piese originale sau echivalente de calitate superioară și oferim garanție 12 luni la orice reparație ${brand}.`
    : `We repair ${brand} fridges and fridge-freezers at your home, in Bucharest and the surrounding area. We diagnose the fault quickly, use original or equivalent quality parts, and back every ${brand} repair with a 12-month warranty.`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
  const postTitle = (p) => (lang === "en" && p.title_en) ? p.title_en : p.title;
  const postExcerpt = (p) => (lang === "en" && p.excerpt_en) ? p.excerpt_en : p.excerpt;
  const postContent = (p) => (lang === "en" && p.content_en) ? p.content_en : p.content;
  const publishedPosts = isAdmin ? posts : posts.filter(p => p.published);
  const postCategories = [...new Set(publishedPosts.map(p => p.category || "General"))];
  const filteredPosts = categoryFilter === "all" ? publishedPosts : publishedPosts.filter(p => (p.category || "General") === categoryFilter);
  const visiblePosts = filteredPosts.slice(0, postsVisible);
  const totalPosts = filteredPosts.length;
  const reviewItems = t.reviews.items;
  const reviewsRating = reviewItems.reduce((sum, r) => sum + r.rating, 0) / reviewItems.length;
  const reviewsSub = t.reviews.sub;
  const commentsForPost = (postId) => postComments[postId] || [];
  const rootComments = (postId) => commentsForPost(postId).filter(c => !c.parent_id);
  const childComments = (postId, parentId) => commentsForPost(postId).filter(c => c.parent_id === parentId);
  const approvedRootComments = (postId) => rootComments(postId).filter(c => c.approved || isAdmin);

  // ===== RENDER =====

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#1e293b", background: "#f8faff" }}>

      {/* ===== HEADER ===== */}
      {/* Note: the blur/background/shadow live on the inner row, not on <header> itself —
          backdrop-filter on an ancestor creates a new containing block for position:fixed
          descendants (like .mobile-nav-overlay below), which broke the mobile menu's full-viewport coverage. */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, height: "68px" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: isScrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderBottom: isScrolled ? "1px solid #e2e8f0" : "none",
          transition: "all 0.3s",
          boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        }} />
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#acasa" onClick={() => setActiveNav("acasa")} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo_0.png" alt="Reparații frigidere" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: "700", fontSize: "15px", color: "#0277bd", lineHeight: "1.1" }}>Reparații frigidere</div>
              <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>Opris Adrian PFA</div>
            </div>
          </a>

          <nav className="desktop-nav" style={{ display: "flex", gap: "6px" }}>
            {Object.entries(t.nav).map(([key, label]) => (
              <a key={key} href={`#${key}`} onClick={() => setActiveNav(key)}
                style={{ textDecoration: "none", fontSize: "13px", fontWeight: "500", color: activeNav === key ? "#0277bd" : "#475569", padding: "6px 10px", borderRadius: "6px", background: activeNav === key ? "#e3f2fd" : "transparent", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.color = "#0277bd"; }}
                onMouseLeave={e => { e.currentTarget.style.background = activeNav === key ? "#e3f2fd" : "transparent"; e.currentTarget.style.color = activeNav === key ? "#0277bd" : "#475569"; }}
              >{label}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="tel:+40737444337" className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#0277bd", color: "white", textDecoration: "none", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#01579b"}
              onMouseLeave={e => e.currentTarget.style.background = "#0277bd"}>
              <FaPhone size={12} /> +40 737 444 337
            </a>
            {isAdmin && (
              <button onClick={handleAdminLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>Admin ✕</button>
            )}
            <div style={{ display: "flex", gap: "4px" }}>
              {["ro", "en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", fontSize: "12px", fontWeight: lang === l ? "700" : "400", color: lang === l ? "#0277bd" : "#94a3b8", cursor: "pointer", textTransform: "uppercase" }}>{l}</button>
              ))}
            </div>
            <button className={`hamburger-btn${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}><span /><span /><span /></button>
          </div>
        </div>

        <div className={`mobile-nav-overlay${menuOpen ? " open" : ""}`}>
          <a href="tel:+40737444337" style={{ background: "#0277bd", color: "white", borderRadius: "10px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <FaPhone /> +40 737 444 337
          </a>
          {Object.entries(t.nav).map(([key, label]) => (
            <a key={key} href={`#${key}`} className={activeNav === key ? "active" : ""} onClick={() => { setActiveNav(key); setMenuOpen(false); }}>{label}</a>
          ))}
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="acasa" style={{ minHeight: "90vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg, #0d1b2a 0%, #01579b 60%, #0288d1 100%)", position: "relative", overflow: "hidden", padding: "80px 40px" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(41,182,246,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>
          <div className="two-col" style={{ display: "flex", alignItems: "center", gap: "48px" }}>
            <img src="/poza-profil.jpg" alt="Opriș Adrian — tehnician frigotehnist autorizat AGFR" style={{
              width: "320px", maxWidth: "100%", height: "auto", borderRadius: "20px", flexShrink: 0,
              border: "3px solid rgba(41,182,246,0.4)", boxShadow: "0 16px 40px rgba(0,0,0,0.4)", animation: "fadeInUp 0.7s ease both",
            }} />
            <div className="hero-content" style={{ animation: "fadeInUp 0.7s ease both", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(41,182,246,0.15)", border: "1px solid rgba(41,182,246,0.3)", color: "#29b6f6", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "28px" }}>
                <FaShieldAlt size={11} /> {t.hero.badge}
              </div>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "56px", fontWeight: "700", color: "white", lineHeight: "1.1", marginBottom: "8px" }}>{t.hero.h1}</h1>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "56px", fontWeight: "700", color: "#29b6f6", lineHeight: "1.1", marginBottom: "24px" }}>{t.hero.h1b}</h1>
              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.75)", maxWidth: "560px", lineHeight: "1.7", marginBottom: "40px" }}>{t.hero.sub}</p>
              <div className="hero-cta-row" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
                <a href={`tel:${t.contact.phoneFull}`} style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#29b6f6", color: "#0d1b2a", padding: "16px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "16px", textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(41,182,246,0.4)", animation: "pulse 2.5s infinite" }}>
                  <FaPhone size={16} /> {t.hero.cta1}: {t.contact.phone} / 07 FRIGIDER
                </a>
                <a href="https://wa.me/40737444337" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#25d366", color: "white", width: "52px", borderRadius: "10px", textDecoration: "none" }}>
                  <FaWhatsapp size={20} />
                </a>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#ff0000", color: "white", width: "52px", borderRadius: "10px", textDecoration: "none" }}>
                  <FaYoutube size={20} />
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1877f2", color: "white", width: "52px", borderRadius: "10px", textDecoration: "none" }}>
                  <FaFacebook size={20} />
                </a>
                <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" aria-label="Google Maps" title="Google Maps" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#ea4335", color: "white", width: "52px", borderRadius: "10px", textDecoration: "none" }}>
                  <FaMapMarkerAlt size={20} />
                </a>
              </div>
              <div className="hero-badges" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {t.hero.badges.map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "500" }}>
                    <FaCheck size={10} color="#4ade80" /> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ME ===== */}
      <section id="despre" className="section-pad" style={{ background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="two-col" style={{ display: "flex", alignItems: "flex-start", gap: "56px" }}>
            <div style={{ flexShrink: 0, width: "300px", maxWidth: "100%" }}>
              <img src="/adrian-1.jpg" alt="Adrian Opriș — tehnician frigotehnist autorizat AGFR" style={{
                width: "100%", height: "auto", borderRadius: "16px", display: "block",
                border: "1px solid #e2e8f0", boxShadow: "0 12px 32px rgba(2,119,189,0.15)",
              }} />
              <div style={{ marginTop: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                {t.about.facts.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", borderBottom: i < t.about.facts.length - 1 ? "1px solid #e2e8f0" : "none", background: i % 2 === 1 ? "#f8faff" : "white" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>{f.label}</span>
                    <span style={{ fontSize: "12px", color: "#0d1b2a", fontWeight: "700", textAlign: "right" }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.about.title}</h2>
              <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "28px" }}>{t.about.sub}</p>
              {t.about.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: "15px", color: "#334155", lineHeight: "1.8", marginBottom: "16px" }}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section style={{ padding: "80px 40px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.process.title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>{t.process.sub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px", marginBottom: "24px" }}>
            {t.process.steps.map((step, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "28px 20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #0277bd, #29b6f6)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontFamily: "'Poppins', sans-serif", fontSize: "20px", fontWeight: "700" }}>{step.n}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0d1b2a", marginBottom: "8px", lineHeight: "1.3" }}>{step.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>{step.desc}</p>
                {step.phone && (
                  <a href={`tel:${t.contact.phoneFull}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "10px", fontSize: "14px", fontWeight: "700", color: "#0277bd", textDecoration: "none", whiteSpace: "nowrap" }}>
                    <FaPhone size={11} /> {step.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>{t.process.note}</p>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="servicii" className="section-pad" style={{ background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.services.title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>{t.services.sub}</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #0277bd, #29b6f6)", borderRadius: "16px", padding: "24px 32px", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "22px" }}>🚗</div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontWeight: "500" }}>{t.services.callout}</div>
                <div style={{ color: "white", fontSize: "28px", fontWeight: "700", fontFamily: "'Poppins', sans-serif" }}>{t.services.calloutPrice}</div>
              </div>
            </div>
            <a href={`tel:${t.contact.phoneFull}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "white", color: "#0277bd", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
              <FaPhone size={13} /> {t.contact.phone}
            </a>
          </div>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
            {t.services.items.map((item, i) => (
              <div key={i} className="price-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: i < t.services.items.length - 1 ? "1px solid #e2e8f0" : "none", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", background: "#e3f2fd", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0277bd", fontSize: "15px" }}>{item.icon}</div>
                  <span style={{ fontSize: "15px", color: "#1e293b", fontWeight: "500" }}>{item.name}</span>
                </div>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#0277bd", whiteSpace: "nowrap", marginLeft: "16px" }}>{item.price}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "16px", lineHeight: "1.6" }}>{t.services.note}</p>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="galerie" style={{ padding: "80px 0", background: "#0d1b2a", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#29b6f6", marginBottom: "12px" }}>
              <FaImages style={{ marginRight: "6px" }} />{lang === "ro" ? "Lucrările noastre" : "Our work"}
            </div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "white" }}>{t.gallery.title}</h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)" }}>{t.gallery.sub}</p>
          </div>

          {/* Carousel */}
          <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)", maxWidth: "860px", margin: "0 auto" }}>
            <div style={{ position: "relative", height: "480px", background: "#0a1520" }}>
              {galleryImages.map((img, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0,
                  opacity: i === galleryIndex ? 1 : 0,
                  transition: "opacity 0.7s ease",
                  pointerEvents: i === galleryIndex ? "auto" : "none",
                }}>
                  <img
                    src={img.url} alt={img.caption}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                </div>
              ))}

              {/* Caption */}
              <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "80px", color: "white", zIndex: 2 }}>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{galleryImages[galleryIndex]?.caption}</p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{galleryIndex + 1} / {galleryImages.length}</p>
              </div>

              {/* Arrow buttons */}
              {[{ dir: -1, icon: <FaChevronLeft />, side: "left" }, { dir: 1, icon: <FaChevronRight />, side: "right" }].map(({ dir, icon, side }) => (
                <button key={side} onClick={() => gallerNav(dir)}
                  style={{
                    position: "absolute", top: "50%", [side]: "16px", transform: "translateY(-50%)", zIndex: 3,
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)",
                    color: "white", width: "44px", height: "44px", borderRadius: "50%",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(41,182,246,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                >{icon}</button>
              ))}

              {/* Admin: add image URL */}
              {isAdmin && (
                <button
                  onClick={() => {
                    const url = window.prompt("URL imagine:");
                    const caption = url && window.prompt("Descriere:");
                    if (url && caption) { setGalleryImages(g => [...g, { url, caption }]); setGalleryIndex(galleryImages.length); }
                  }}
                  style={{ position: "absolute", top: "12px", right: "12px", zIndex: 3, background: "rgba(41,182,246,0.8)", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                  <FaPlus size={10} /> {lang === "ro" ? "Adaugă" : "Add"}
                </button>
              )}
            </div>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "16px", background: "#111827" }}>
              {galleryImages.map((_, i) => (
                <button key={i} onClick={() => { clearInterval(galleryTimer.current); setGalleryIndex(i); galleryTimer.current = setInterval(advanceGallery, 4500); }}
                  style={{ width: i === galleryIndex ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === galleryIndex ? "#29b6f6" : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section style={{ padding: "60px 40px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "32px", fontWeight: "700", marginBottom: "8px", color: "#0d1b2a" }}>{t.brands.title}</h2>
            <p style={{ fontSize: "15px", color: "#64748b" }}>{t.brands.sub}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {BRANDS.map(brand => {
              const active = selectedBrand === brand;
              return (
                <a key={brand} href="#marca-frigider" onClick={() => setSelectedBrand(brand)}
                  style={{ background: active ? "#0277bd" : "#f8faff", border: `1px solid ${active ? "#0277bd" : "#e2e8f0"}`, padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: active ? "white" : "#475569", transition: "all 0.2s", textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#e3f2fd"; e.currentTarget.style.color = "#0277bd"; e.currentTarget.style.borderColor = "#0277bd"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "#f8faff"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "#e2e8f0"; } }}>{brand}</a>
              );
            })}
          </div>

          {/* Brand spotlight — generic fridge illustration with a turquoise nameplate for the selected brand (SEO-friendly per-brand copy) */}
          <div id="marca-frigider" style={{ marginTop: "40px", scrollMarginTop: "84px", background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 220px", margin: "0 auto" }}>
              <FridgeIllustration brand={selectedBrand} />
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "700", margin: "0 0 10px", color: "#0d1b2a" }}>
                {lang === "ro" ? "Reparații frigidere " : "Fridge repairs — "}<span style={{ color: "#0d9488" }}>{selectedBrand}</span>
              </h3>
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#64748b", margin: 0 }}>{brandRepairText(selectedBrand)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ZONES ===== */}
      <section id="zone" className="section-pad" style={{ background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#0277bd", marginBottom: "12px" }}><FaMapMarkerAlt style={{ marginRight: "6px" }} />București & împrejurimi</div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.zones.title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>{t.zones.sub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            {[
              { icon: "🏙️", title: t.zones.sectors, desc: t.zones.sectorsDesc, items: ZONE_SECTORS },
              { icon: "🏘️", title: t.zones.neighborhoods, desc: t.zones.neighborhoodsDesc, items: ZONE_NEIGHBORHOODS },
              { icon: "🛣️", title: t.zones.suburbs, desc: t.zones.suburbsDesc, items: ZONE_SUBURBS },
            ].map((z, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{z.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0d1b2a", marginBottom: "10px" }}>{z.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7", marginBottom: "16px" }}>{z.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {z.items.map(zi => {
                    const active = highlightedZone === zi.id;
                    return (
                      <a key={zi.id} href="#harta-zone" onClick={() => setHighlightedZone(zi.id)}
                        style={{ fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px", textDecoration: "none", cursor: "pointer", transition: "all 0.15s", background: active ? "#0277bd" : "#f1f5f9", color: active ? "white" : "#475569", border: `1px solid ${active ? "#0277bd" : "#e2e8f0"}` }}>
                        {zi.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive schematic map — click a sector/neighborhood/locality chip above (or a shape below) to highlight it in blue */}
          <div id="harta-zone" style={{ scrollMarginTop: "84px", background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0d1b2a", margin: 0 }}>
                {lang === "ro" ? "Hartă interactivă a zonelor deservite" : "Interactive map of the areas we cover"}
              </h3>
              {highlightedZone && (
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0277bd" }}>
                  {ZONE_ALL.find(z => z.id === highlightedZone)?.name}
                </span>
              )}
            </div>
            <InteractiveZoneMap highlighted={highlightedZone} onSelect={setHighlightedZone} />
            <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", marginTop: "12px", marginBottom: 0 }}>
              {lang === "ro"
                ? "Click pe un sector, un cartier sau o localitate pentru a-l evidenția pe hartă."
                : "Click a sector, a neighborhood, or a locality to highlight it on the map."}
            </p>
          </div>

          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.8", background: "white", padding: "20px 24px", borderRadius: "12px", borderLeft: "4px solid #0277bd" }}>{t.zones.seoText}</p>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section id="recenzii" className="section-pad" style={{ background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.reviews.title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>{reviewsSub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: reviewItems.length > 5 ? "16px" : "48px" }}>
            {reviewItems.slice(0, reviewsVisible).map((r, i) => (
              <div key={i} style={{ background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(2,119,189,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <Stars rating={r.rating} />
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", marginBottom: "16px", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #0277bd, #29b6f6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>{r.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{r.name}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{r.zone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {reviewItems.length > 5 && (
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: "0 0 12px" }}>
                {t.blog.showOf} {Math.min(reviewsVisible, reviewItems.length)} {t.blog.of} {reviewItems.length} {lang === "ro" ? "recenzii" : "reviews"}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {reviewsVisible < reviewItems.length && <button onClick={() => setReviewsVisible(v => v + 5)} className="btn-primary">{t.reviews.loadMore} ↓</button>}
                {reviewsVisible > 5 && <button onClick={() => setReviewsVisible(5)} className="btn-secondary">{t.reviews.loadLess} ↑</button>}
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="two-col">
            <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", minHeight: "300px" }}>
              <iframe title={t.reviews.mapTitle} src="https://maps.google.com/maps?q=Bulevardul+Timisoara+53,+Sector+6,+Bucuresti&output=embed" width="100%" height="300" style={{ border: "none", display: "block" }} loading="lazy" />
            </div>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" style={{ background: "#f0f7ff", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#e3f2fd"}
              onMouseLeave={e => e.currentTarget.style.background = "#f0f7ff"}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0d1b2a", marginBottom: "8px" }}>{reviewsRating.toFixed(1)} / 5.0</h3>
              <p style={{ fontSize: "14px", color: "#0277bd", fontWeight: "600", margin: 0, lineHeight: "1.6" }}>{lang === "ro" ? "Bazat pe recenziile Google Maps" : "Based on the Google Maps reviews"}</p>
            </a>
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section id="blog" className="section-pad" style={{ background: "#f8faff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {activeBlogPost ? (
            /* ---- POST VIEW ---- */
            <div>
              <button onClick={() => setActiveBlogPost(null)} style={{ background: "none", border: "none", color: "#0277bd", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "28px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
                {t.blog.backToList}
              </button>

              <article>
                {activeBlogPost.image_url && (
                  <img src={activeBlogPost.image_url} alt={postTitle(activeBlogPost)} style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "16px", marginBottom: "32px" }} />
                )}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                  <CategoryBadge cat={activeBlogPost.category} />
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>{formatDate(activeBlogPost.created_at)}</span>
                  {isAdmin && !activeBlogPost.published && <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>Nepublicat</span>}
                </div>
                <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "32px", fontWeight: "700", color: "#0d1b2a", marginBottom: "24px", lineHeight: "1.2" }}>{postTitle(activeBlogPost)}</h1>
                <div className="prose" dangerouslySetInnerHTML={{ __html: (postContent(activeBlogPost) || "").replace(/\n/g, "<br/>") }} />
              </article>

              {/* Article reactions */}
              {(() => {
                const rx = postReactions[activeBlogPost.id] || { like: 0, love: 0, dislike: 0, mine: null };
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "32px", padding: "18px 20px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", marginRight: "4px" }}>{t.blog.reactions.label}</span>
                    {(["like", "love", "dislike"]).map(type => (
                      <ReactionBtn key={type} type={type} count={rx[type] || 0} active={rx.mine === type} onClick={() => handlePostReaction(activeBlogPost.id, type)} />
                    ))}
                    {rx.love > 0 && <span style={{ fontSize: "12px", color: "#e91e63", marginLeft: "4px" }}>❤️ {rx.love} {lang === "ro" ? "au găsit util" : "found useful"}</span>}
                  </div>
                );
              })()}

              {/* Admin post controls */}
              {isAdmin && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px", padding: "16px 20px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", flexWrap: "wrap" }}>
                  <button onClick={() => { setEditingPost(activeBlogPost); setPostForm({ title: activeBlogPost.title, excerpt: activeBlogPost.excerpt || "", content: activeBlogPost.content, category: activeBlogPost.category || "General", image_url: activeBlogPost.image_url || "" }); setShowNewPostForm(true); }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f59e0b", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                    <FaEdit size={12} /> {t.blog.editArticle}
                  </button>
                  <button onClick={() => handleTogglePublish(activeBlogPost)} style={{ display: "flex", alignItems: "center", gap: "6px", background: activeBlogPost.published ? "#64748b" : "#16a34a", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                    {activeBlogPost.published ? <><FaEyeSlash size={12} /> {t.blog.unpublish}</> : <><FaEye size={12} /> {t.blog.publish}</>}
                  </button>
                  <button onClick={() => handleDeletePost(activeBlogPost.id)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                    <FaTrash size={12} /> {t.blog.deleteArticle}
                  </button>
                </div>
              )}

              {/* Comments */}
              <div style={{ marginTop: "56px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#0d1b2a", marginBottom: "28px", paddingBottom: "12px", borderBottom: "2px solid #e2e8f0" }}>
                  {t.blog.comments} ({commentsForPost(activeBlogPost.id).filter(c => c.approved || isAdmin).length})
                </h3>

                {approvedRootComments(activeBlogPost.id).length === 0 ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", marginBottom: "32px" }}>{t.blog.noComments}</p>
                ) : (
                  approvedRootComments(activeBlogPost.id).slice(0, commentsVisible).map(c => {
                    const crx = commentReactions[c.id] || { like: 0, love: 0, dislike: 0, mine: null };
                    return (
                      <div key={c.id} style={{ marginBottom: "20px" }}>
                        {/* Root comment */}
                        <div style={{ background: "white", borderRadius: "12px", padding: "18px", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                                <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #0277bd, #29b6f6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "13px" }}>{c.username.charAt(0).toUpperCase()}</div>
                                <div>
                                  <span style={{ fontWeight: "600", fontSize: "14px", color: "#0d1b2a" }}>{c.username}</span>
                                  <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "8px" }}>{formatDate(c.created_at)}</span>
                                  {!c.approved && <span style={{ marginLeft: "8px", fontSize: "10px", background: "#fef2f2", color: "#dc2626", padding: "2px 6px", borderRadius: "4px" }}>{t.blog.pending}</span>}
                                </div>
                              </div>
                              <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", marginLeft: "42px", marginBottom: "10px" }}>{c.text}</p>
                              {/* Comment reactions */}
                              <div style={{ display: "flex", gap: "6px", marginLeft: "42px", flexWrap: "wrap" }}>
                                {(["like", "love", "dislike"]).map(type => (
                                  <ReactionBtn key={type} type={type} count={crx[type] || 0} active={crx.mine === type} onClick={() => handleCommentReaction(c.id, type)} size="sm" />
                                ))}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "6px", marginLeft: "12px", flexShrink: 0 }}>
                              <button onClick={() => { setReplyTo(c.id); document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" }); }}
                                style={{ background: "#e3f2fd", color: "#0277bd", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <FaReply size={10} /> Reply
                              </button>
                              {isAdmin && !c.approved && (
                                <button onClick={() => approveComment(activeBlogPost.id, c.id)} style={{ background: "#dcfce7", color: "#16a34a", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}><FaCheck size={10} /></button>
                              )}
                              {isAdmin && (
                                <button onClick={() => deleteComment(activeBlogPost.id, c.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}><FaTrash size={10} /></button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {childComments(activeBlogPost.id, c.id).filter(r => r.approved || isAdmin).map(r => {
                          const rrx = commentReactions[r.id] || { like: 0, love: 0, dislike: 0, mine: null };
                          return (
                            <div key={r.id} style={{ marginLeft: "32px", marginTop: "10px", background: "#f0f7ff", borderRadius: "10px", padding: "14px 16px", border: "1px solid #bfdbfe" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                                    <div style={{ width: "26px", height: "26px", background: "#0277bd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "11px" }}>{r.username.charAt(0).toUpperCase()}</div>
                                    <span style={{ fontWeight: "600", fontSize: "13px", color: "#0277bd" }}>{r.username}</span>
                                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{formatDate(r.created_at)}</span>
                                    {!r.approved && <span style={{ fontSize: "10px", background: "#fef2f2", color: "#dc2626", padding: "2px 6px", borderRadius: "4px" }}>{t.blog.pending}</span>}
                                  </div>
                                  <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", marginLeft: "34px", marginBottom: "8px" }}>{r.text}</p>
                                  <div style={{ display: "flex", gap: "6px", marginLeft: "34px" }}>
                                    {(["like", "love", "dislike"]).map(type => (
                                      <ReactionBtn key={type} type={type} count={rrx[type] || 0} active={rrx.mine === type} onClick={() => handleCommentReaction(r.id, type)} size="sm" />
                                    ))}
                                  </div>
                                </div>
                                {isAdmin && (
                                  <div style={{ display: "flex", gap: "4px", marginLeft: "8px" }}>
                                    {!r.approved && <button onClick={() => approveComment(activeBlogPost.id, r.id)} style={{ background: "#dcfce7", color: "#16a34a", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}><FaCheck size={9} /></button>}
                                    <button onClick={() => deleteComment(activeBlogPost.id, r.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}><FaTrash size={9} /></button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}

                {approvedRootComments(activeBlogPost.id).length > 5 && (
                  <div style={{ marginTop: "4px" }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", margin: "0 0 10px" }}>
                      {t.blog.showOf} {Math.min(commentsVisible, approvedRootComments(activeBlogPost.id).length)} {t.blog.of} {approvedRootComments(activeBlogPost.id).length} {lang === "ro" ? "comentarii" : "comments"}
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {commentsVisible < approvedRootComments(activeBlogPost.id).length && (
                        <button onClick={() => setCommentsVisible(v => v + 5)} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>{t.blog.loadMoreComments} ↓</button>
                      )}
                      {commentsVisible > 5 && (
                        <button onClick={() => setCommentsVisible(5)} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>{t.blog.loadLessComments} ↑</button>
                      )}
                    </div>
                  </div>
                )}

                {/* Add comment form */}
                <div id="comment-form" style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", marginTop: "32px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0d1b2a", marginBottom: "16px" }}>{t.blog.addComment}</h4>
                  {replyTo && (
                    <div style={{ background: "#e3f2fd", borderRadius: "8px", padding: "8px 14px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#0277bd" }}>
                      <span>{t.blog.replyTo} <strong>{commentsForPost(activeBlogPost.id).find(c => c.id === replyTo)?.username}</strong></span>
                      <button onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", color: "#0277bd", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
                    </div>
                  )}
                  <input type="text" value={commentUsername} onChange={e => setCommentUsername(e.target.value)} placeholder={t.blog.namePlaceholder}
                    style={{ width: "100%", padding: "10px 14px", marginBottom: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t.blog.commentPlaceholder}
                    style={{ width: "100%", padding: "10px 14px", minHeight: "80px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                  <button onClick={handleAddComment} className="btn-primary" style={{ marginTop: "12px" }}>{t.blog.submit}</button>
                </div>
              </div>
            </div>
          ) : (
            /* ---- BLOG LIST VIEW ---- */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#0277bd", marginBottom: "12px" }}>Sfaturi utile</div>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "8px", color: "#0d1b2a" }}>{t.blog.title}</h2>
                  <p style={{ fontSize: "16px", color: "#64748b" }}>{t.blog.sub}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {postCategories.length > 1 && (
                    <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPostsVisible(6); }}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontFamily: "inherit", fontSize: "13px", fontWeight: "600", color: "#475569", background: "white", cursor: "pointer", outline: "none" }}>
                      <option value="all">{t.blog.allCategories}</option>
                      {postCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                  {isAdmin && (
                    <button onClick={() => { setShowNewPostForm(true); setEditingPost(null); setPostForm({ title: "", excerpt: "", content: "", category: "General", image_url: "" }); }} className="btn-primary">
                      <FaPlus size={12} /> {t.blog.newArticle}
                    </button>
                  )}
                </div>
              </div>

              {/* Article editor */}
              {showNewPostForm && (
                <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #e2e8f0", marginBottom: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0d1b2a", marginBottom: "20px" }}>
                    {editingPost ? t.blog.editArticle : t.blog.newArticle}
                  </h3>
                  {[
                    { label: t.blog.titleLabel, key: "title", type: "input" },
                    { label: t.blog.excerptLabel, key: "excerpt", type: "textarea", rows: 2 },
                    { label: t.blog.contentLabel, key: "content", type: "textarea", rows: 10 },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea value={postForm[f.key]} onChange={e => setPostForm(p => ({ ...p, [f.key]: e.target.value }))} rows={f.rows || 4}
                          style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                      ) : (
                        <input type="text" value={postForm[f.key]} onChange={e => setPostForm(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                      )}
                    </div>
                  ))}

                  {/* Image: URL + upload */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{t.blog.imageLabel}</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input type="text" value={postForm.image_url} onChange={e => setPostForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..."
                        style={{ flex: 1, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", outline: "none" }} />
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: uploading ? "#94a3b8" : "#0277bd", color: "white", padding: "10px 16px", borderRadius: "8px", cursor: uploading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
                        <FaUpload size={12} /> {uploading ? "..." : t.blog.imageUpload}
                        <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading} onChange={e => handleImageUpload(e.target.files?.[0])} />
                      </label>
                    </div>
                    {postForm.image_url && (
                      <img src={postForm.image_url} alt="preview" style={{ marginTop: "8px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }} onError={e => e.currentTarget.style.display = "none"} />
                    )}
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{t.blog.categoryLabel}</label>
                    <select value={postForm.category} onChange={e => setPostForm(p => ({ ...p, category: e.target.value }))}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", outline: "none", background: "white" }}>
                      {["General", "Sfaturi", "No-Frost", "Urgențe", "Întreținere"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleSavePost} className="btn-primary">{t.blog.saveArticle}</button>
                    <button onClick={() => { setShowNewPostForm(false); setEditingPost(null); }} className="btn-secondary">{t.blog.cancelEdit}</button>
                  </div>
                </div>
              )}

              {totalPosts === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                  <p style={{ fontSize: "16px" }}>{t.blog.noArticles}</p>
                </div>
              ) : (
                <>
                  <div className="grid-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                    {visiblePosts.map(post => (
                      <div key={post.id} className="blog-card" style={{ background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" }} onClick={() => openPost(post)}>
                        {post.image_url ? (
                          <img src={post.image_url} alt={postTitle(post)} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                        ) : (
                          <div style={{ height: "120px", background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>❄️</div>
                        )}
                        <div style={{ padding: "20px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                            <CategoryBadge cat={post.category} />
                            {isAdmin && !post.published && <span style={{ fontSize: "10px", background: "#fef2f2", color: "#dc2626", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>Draft</span>}
                          </div>
                          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0d1b2a", marginBottom: "10px", lineHeight: "1.3" }}>{postTitle(post)}</h3>
                          {postExcerpt(post) && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", marginBottom: "16px" }}>{postExcerpt(post)}</p>}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{formatDate(post.created_at)}</span>
                            <span style={{ fontSize: "13px", color: "#0277bd", fontWeight: "600" }}>{t.blog.readMore} →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPosts > 6 && (
                    <div style={{ marginTop: "32px", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>{t.blog.showOf} {Math.min(postsVisible, totalPosts)} {t.blog.of} {totalPosts} {t.blog.articles}</p>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        {postsVisible < totalPosts && <button onClick={() => setPostsVisible(v => v + 6)} className="btn-primary">{t.blog.loadMore} ↓</button>}
                        {postsVisible > 6 && <button onClick={() => setPostsVisible(6)} className="btn-secondary">{t.blog.loadLess} ↑</button>}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={{ padding: "80px 40px", background: "white" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.faq.title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>{t.faq.sub}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {t.faq.items.map((item, i) => (
              <div key={i} style={{ background: "#f8faff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#0d1b2a", lineHeight: "1.4" }}>{item.q}</span>
                  <span style={{ color: "#0277bd", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none" }}><FaChevronDown size={14} /></span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px", animation: "fadeIn 0.2s ease" }}>
                    <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.8", borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" style={{ padding: "80px 40px", background: "linear-gradient(135deg, #0d1b2a 0%, #01579b 100%)", color: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "white" }}>{t.contact.title}</h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginBottom: "56px" }}>{t.contact.sub}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "12px" }}>
            {[
              { icon: <FaWhatsapp />, href: "https://wa.me/40737444337" },
              { icon: <FaYoutube />, href: YOUTUBE_URL },
              { icon: <FaFacebook />, href: FACEBOOK_URL },
            ].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px 6px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "center", fontSize: "22px", color: "#29b6f6", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "white"}
                onMouseLeave={e => e.currentTarget.style.color = "#29b6f6"}>{item.icon}</a>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
            {[
              { icon: <FaPhone />, value: t.contact.phone, href: `tel:${t.contact.phoneFull}` },
              { icon: <FaEnvelope />, value: t.contact.email, href: `mailto:${t.contact.email}` },
              { icon: <FaClock />, value: t.contact.hours, href: null },
              { icon: <FaMapMarkerAlt />, value: t.contact.address, href: GOOGLE_REVIEWS_URL },
            ].map((item, i) => {
              const Tag = item.href ? "a" : "div";
              return (
                <Tag key={i}
                  {...(item.href ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" } : {})}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.1)", color: item.href ? "white" : "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}
                  onMouseEnter={item.href ? (e => e.currentTarget.style.color = "#29b6f6") : undefined}
                  onMouseLeave={item.href ? (e => e.currentTarget.style.color = "white") : undefined}>
                  <span style={{ color: "#29b6f6", display: "flex", fontSize: "16px" }}>{item.icon}</span> {item.value}
                </Tag>
              );
            })}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.8", marginBottom: "24px" }}>
            <p style={{ margin: 0 }}>{t.contact.legalAddress}</p>
            <p style={{ margin: 0 }}>
              {t.contact.consumerProtection}{" "}
              <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.6)" }}>anpc.ro</a>
            </p>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", margin: 0, userSelect: "none" }}>
            © <span onClick={() => (isAdmin ? handleAdminLogout() : setShowAdminLogin(true))} style={{ cursor: "default" }}>2026</span> {t.contact.copyright}
          </p>
        </div>
      </section>

      {/* ===== FLOATING PHONE ===== */}
      <a href={`tel:${t.contact.phoneFull}`} style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 50, background: "#0277bd", color: "white", width: "58px", height: "58px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(2,119,189,0.5)", textDecoration: "none", transition: "all 0.3s", animation: "pulse 3s infinite" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        title={t.contact.phone}>
        <FaPhone size={22} />
      </a>

      {/* ===== TOAST ===== */}
      {toast && (
        <div key={toast.id} style={{ position: "fixed", bottom: "104px", right: "28px", zIndex: 200, background: "#0d1b2a", color: "white", padding: "14px 18px 10px", borderRadius: "10px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", minWidth: "220px", maxWidth: "300px", animation: "slideIn 0.2s ease" }}>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "500" }}>{toast.message}</p>
          <div style={{ height: "3px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", animation: "toastProgress 5s linear forwards" }} />
          </div>
        </div>
      )}

      {/* ===== SUBMISSION ALERT ===== */}
      {submissionAlert && (
        <div onClick={() => setSubmissionAlert(null)} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", padding: "40px 32px", maxWidth: "380px", width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.25)", animation: "fadeInUp 0.25s ease" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#dcfce7", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaCheck size={22} color="#16a34a" />
            </div>
            <p style={{ margin: "0 0 24px", fontSize: "15px", lineHeight: "1.7", color: "#1e293b" }}>{submissionAlert}</p>
            <button onClick={() => setSubmissionAlert(null)} className="btn-primary">OK</button>
          </div>
        </div>
      )}

      {/* ===== ADMIN LOGIN ===== */}
      {showAdminLogin && (
        <div onClick={() => { setShowAdminLogin(false); setAdminPassword(""); setAdminError(""); }}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", padding: "40px", borderRadius: "16px", width: "340px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
            <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "700", color: "#0d1b2a" }}>Admin Login</h3>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} placeholder="Parolă" autoFocus
              style={{ width: "100%", padding: "10px 14px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
            {adminError && <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#ef4444" }}>{adminError}</p>}
            <button onClick={handleAdminLogin} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Intră</button>
          </div>
        </div>
      )}
    </div>
  );
}
