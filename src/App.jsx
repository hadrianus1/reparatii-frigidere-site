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
// Real Bucharest sector boundaries (traced polygons, CC0 — Wikimedia Commons
// "Bucuresti sectors.svg"), with neighborhoods/localities placed at their
// approximate real position within each sector (verified to fall inside the
// sector's actual shape, not just its bounding box).

const polarXY = (cx, cy, bearingDeg, r) => {
  const rad = (bearingDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const SECTOR_PATHS = {
  1: "M224.8,28.5l-16.3,6.1v12.2l-26.5,9.2-5.1-4.1-5.1,3,3.1,6.1-21.4,10.2-7.2-8.2-8.2,13.2,4.1,6.1-25.5,13.2-3.1,29.6h-10.2l-9.2,11.2-10.2-10.2-11.2,7.1-1,6.1,11.2,12.2-11.2,21.4v14.3l17.3-21.4h45.9l62.2,38.8,20.4,28.6,10.2,26.5-7.1,6.1,40.2,1.8-3.5-2.8,9.2-25.5-2-7.1-1-32.6,7.2-12.2-8.2-21.4,21.8-13.9-4.5-9.6,2.1-6.1-12.2-14.3,12.2-8.2-4.1-3.1-9.2,1-1-22.4,5.1-3.1-4.1-7.1v-16.3l-1-5.1v-21.4l-7.2-6.1-6.1,7.2-24.5,2-5.1-11.2h0Z",
  2: "M285,151.9l-22.4,14.3,8.2,21.4-7.2,12.2,1,32.6,2,7.1-9.2,25.5,6.1,4.9,11.2-.8,9.2,1,2,3.1,26.5,3.1,23.4-4.1,81.6-23.5,1.1-1.3-1.1-8.9-9.2-7.2-1-8.2-5.1,1v16.3l-5.1-1-7.1,1-6.1,2,1-12.2,3.1-7.2-7.2-1-10.2,5.1-3.1-5.1-7.2-5.1-5.1,5.1-5.1-6.1,33.7-44.9-14.3-5.1-12.2-2.1-72.4-12.2h0Z",
  3: "M424.7,235.5l1,5.1h5.1l-5.1,3.1-2-2-6.1,7.1-81.6,23.5-23.4,4.1-26.5-3.1-2-3.1-9.2-1-14.3,1-5.9,13.4,1.8-3.2,5.1,1,7.1,7.2h5.1l4.1,8.2,3.1,10.2,7.1,7.2,6.1,10.2,32.7,12.2,32.6,7.1-1.3,4.8,28.8,7.4,38.8-2.1v-6.1l7.2-4.1,1-10.2,16.3-4.1-1-27.5,7.1,1,4.1-12.2-5.1-4.1,3.1-14.2h6.1l-1,8.2,13.2-5.1v-17.3l-11.2-5.1-5.1-5.1-2.1,9.2-25.5-3.1v-6.1l3-7.1-5.1-5.1h-6.1Z",
  4: "M368.6,471.1l-17.3,7.1,3.1,9.2-8.2,4.1-6.1-3.1-5.1-6.1-11.2,3.1-3.1-5.1,6.1-3.1-15.3-31.6-20.4-1-9.2-13.3,3.1-6.1-24.5-8.2-3.1,5.1-2,2-8.2-10.2h-3.1l5.1-33.7-1-9.2,8.2-26.5-3.1-13.3-5.1-7.1-6.1-3.1,5.1-12.2-4.1-11.2,9.2-10.2,4.1-7.1,5.1,1,7.1,7.1h5.1l4.1,8.2,3.1,10.2,7.1,7.1,6.1,10.2,32.6,12.2,32.6,7.1-3.1,11.2-23.5,47.9,3.1,4.1-6.1,7.1,29.6,49,7.1-2,2,10.2h0Z",
  5: "M213.6,262l-14.3,9.2,2.1,8.2-4.1,28.6-13.2,5.1-89.8,17.3,3.1,8.2h9.2l7.1,6.1,9.2-9.2,18.3,27.5,9.2,10.2,9.2-5.1,5.1,5.1-5.1,7.2,14.2,18.3,74.5,16.7-1.1-1.3h-3.1l5.1-33.7-1-9.2,8.2-26.5-3.1-13.3-5.1-7.1-6.1-3.1,5.1-12.2-4.1-11.2,9.2-10.2,2.2-3.9,5.9-13.4,3-.2-2.6-2.1-38.8-1.7-1.3.9-7.2-5.1h0Z",
  6: "M89.2,166.2l-16,19.8-8.4,16.9,20.4,6.1,41.8,13.3v9.2l1,8.2,7.1,2.1-10.2,10.2-74.4,6.1,2,8.2-8.2,1-1,10.2,7.2,3.1,3.1,20.4-10.2,3.1,3.1,8.2,9.2-2,9.2,25.5,10.2-3.1,13.2,4.1,4.1-8.2,4.1,1.6,87.7-16.9,13.2-5.1,4.1-28.6-2.1-8.2,14.3-9.2,7.2,5.1,1.3-.9h-1.3c0,0,7.1-6.2,7.1-6.2l-10.2-26.5-20.4-28.6-62.2-38.8h-45.9Z",
};

const SECTOR_LABEL_POS = { 1: [194, 139], 2: [335, 218], 3: [381, 291], 4: [304, 392], 5: [195, 336], 6: [124, 252] };

const ZONE_SECTORS = [1, 2, 3, 4, 5, 6].map(n => ({ id: `sector-${n}`, name: `Sector ${n}` }));

const ZONE_NEIGHBORHOODS = [
  { id: "baneasa", name: "Băneasa", sector: 1, x: 190.6, y: 60.8 },
  { id: "otopeni", name: "Otopeni", sector: 1, x: 200, y: -10 },
  { id: "pipera", name: "Pipera", sector: 1, x: 253, y: 88 },
  { id: "aviatiei", name: "Aviației", sector: 1, x: 146, y: 112 },
  { id: "grivita", name: "Grivița", sector: 1, x: 190.6, y: 197.7 },
  { id: "dorobanti", name: "Dorobanți", sector: 1, x: 221, y: 184 },
  { id: "floreasca", name: "Floreasca", sector: 1, x: 242, y: 160 },
  { id: "colentina", name: "Colentina", sector: 2, x: 306, y: 177 },
  { id: "obor", name: "Obor", sector: 2, x: 298, y: 214 },
  { id: "iancului", name: "Iancului", sector: 2, x: 330, y: 233 },
  { id: "pantelimon", name: "Pantelimon", sector: 2, x: 386, y: 226 },
  { id: "dristor", name: "Dristor", sector: 3, x: 323.9, y: 275.6 },
  { id: "vitan", name: "Vitan", sector: 3, x: 310, y: 302 },
  { id: "titan", name: "Titan", sector: 3, x: 398, y: 290 },
  { id: "tineretului", name: "Tineretului", sector: 4, x: 296.1, y: 334.2 },
  { id: "vacaresti", name: "Văcărești", sector: 4, x: 312, y: 375 },
  { id: "berceni", name: "Berceni", sector: 4, x: 318, y: 439 },
  { id: "rahova", name: "Rahova", sector: 5, x: 150, y: 355 },
  { id: "ferentari", name: "Ferentari", sector: 5, x: 187, y: 369 },
  { id: "crangasi", name: "Crângași", sector: 6, x: 165, y: 235 },
  { id: "giulesti", name: "Giulești", sector: 6, x: 150, y: 270 },
  { id: "drumul-taberei", name: "Drumul Taberei", sector: 6, x: 117, y: 294 },
  { id: "militari", name: "Militari", sector: 6, x: 71, y: 259 },
];

// rx/ry: an approximate footprint (not a surveyed boundary) sized roughly by each
// town/commune's real relative size, so it reads as a place, not just a pin. Roșu
// (a village inside Chiajna commune) and Militari Residence (a private residential
// development) aren't independent administrative units, so they stay as plain points.
const ZONE_SUBURBS = [
  { id: "voluntari", name: "Voluntari", bearing: 35, rx: 34, ry: 24 },
  { id: "chiajna", name: "Chiajna", bearing: 265, rx: 36, ry: 22 },
  { id: "militari-residence", name: "Militari Residence", bearing: 255 },
  { id: "rosu", name: "Roșu", bearing: 240 },
  { id: "domnesti", name: "Domnești", bearing: 225, rx: 24, ry: 18 },
  { id: "clinceni", name: "Clinceni", bearing: 210, rx: 20, ry: 16 },
  { id: "bragadiru", name: "Bragadiru", bearing: 195, rx: 26, ry: 20 },
  { id: "cornetu", name: "Cornetu", bearing: 185, rx: 18, ry: 14 },
  { id: "magurele", name: "Măgurele", bearing: 175, rx: 28, ry: 20 },
  { id: "popesti-leordeni", name: "Popești-Leordeni", bearing: 145, rx: 32, ry: 22 },
];

const ZONE_MAP_CENTER = { x: 235, y: 255 };
const ZONE_SUBURB_RADIUS = 345;

const ZONE_ALL = [...ZONE_SECTORS, ...ZONE_NEIGHBORHOODS, ...ZONE_SUBURBS];

function InteractiveZoneMap({ highlighted, onSelect }) {
  const activeNeighborhood = ZONE_NEIGHBORHOODS.find(n => n.id === highlighted);
  const activeSectorNum = highlighted?.startsWith("sector-")
    ? Number(highlighted.split("-")[1])
    : activeNeighborhood?.sector;

  return (
    <svg viewBox="-160 -60 780 700" style={{ width: "100%", height: "auto", maxWidth: "860px", display: "block", margin: "0 auto" }}>
      <rect x="-160" y="-60" width="780" height="700" fill="white" />
      {ZONE_SECTORS.map(s => {
        const n = Number(s.id.split("-")[1]);
        const [lx, ly] = SECTOR_LABEL_POS[n];
        const isActive = highlighted === s.id;
        const isParent = !isActive && activeSectorNum === n;
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
            <path d={SECTOR_PATHS[n]}
              fill={isActive ? "#0277bd" : isParent ? "#bfe3fb" : "#eef4fb"}
              stroke="#cbd5e1" strokeWidth="2" style={{ transition: "fill 0.25s" }} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize="20" fontWeight="700" fill={isActive ? "white" : "#94a3b8"} style={{ pointerEvents: "none" }}>{n}</text>
          </g>
        );
      })}

      {ZONE_NEIGHBORHOODS.map(nb => {
        const isActive = highlighted === nb.id;
        return (
          <g key={nb.id} onClick={() => onSelect(nb.id)} style={{ cursor: "pointer" }}>
            <circle cx={nb.x} cy={nb.y} r={isActive ? 9 : 5.5}
              fill={isActive ? "#ea580c" : "white"} stroke={isActive ? "#ea580c" : "#0277bd"} strokeWidth="2"
              style={{ transition: "all 0.2s" }} />
            {isActive && <text x={nb.x} y={nb.y - 14} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0d1b2a" style={{ pointerEvents: "none" }}>{nb.name}</text>}
          </g>
        );
      })}

      {ZONE_SUBURBS.map(sb => {
        const p = polarXY(ZONE_MAP_CENTER.x, ZONE_MAP_CENTER.y, sb.bearing, ZONE_SUBURB_RADIUS);
        const isActive = highlighted === sb.id;
        const labelY = sb.rx ? p.y - sb.ry - 8 : p.y - 14;
        return (
          <g key={sb.id} onClick={() => onSelect(sb.id)} style={{ cursor: "pointer" }}>
            {sb.rx ? (
              <ellipse cx={p.x} cy={p.y} rx={sb.rx} ry={sb.ry}
                fill={isActive ? "#ea580c" : "#f8fafc"} stroke={isActive ? "#ea580c" : "#94a3b8"} strokeWidth="2"
                style={{ transition: "all 0.2s" }} />
            ) : (
              <circle cx={p.x} cy={p.y} r={isActive ? 9 : 5.5}
                fill={isActive ? "#ea580c" : "white"} stroke={isActive ? "#ea580c" : "#94a3b8"} strokeWidth="2"
                strokeDasharray={isActive ? "" : "2,1.5"} style={{ transition: "all 0.2s" }} />
            )}
            {isActive && <text x={p.x} y={labelY} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0d1b2a" style={{ pointerEvents: "none" }}>{sb.name}</text>}
            {!isActive && sb.rx && <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="600" fill="#94a3b8" style={{ pointerEvents: "none" }}>{sb.name}</text>}
          </g>
        );
      })}
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
      nav: { acasa: "Acasă", servicii: "Servicii", galerie: "Galerie", zone: "Zone", blog: "Blog", recenzii: "Recenzii", contact: "Contact" },
      hero: {
        badge: "Autorizat AGFR • 16+ ani experiență",
        h1: "Frigiderul s-a defectat?",
        h1b: "Îl reparăm la domiciliul tău.",
        sub: "Tehnician frigotehnist autorizat certificat pentru frigidere, combine frigorifice și congelatoare. Intervenție rapidă în București și împrejurimi.",
        cta1: "Sună Acum",
        badges: ["Garanție 12 luni", "Factură fiscală", "Piese originale", "Deplasare 70 lei"],
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
          { n: "1", title: "Suni sau trimiți WhatsApp", desc: "Ne contactezi la +40 737 444 337, descrii problema și stabilim o oră convenabilă." },
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
        title: "Ce spun clienții", sub: "16+ ani de reparații frigidere în București",
        mapTitle: "Locația noastră",
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
      nav: { acasa: "Home", servicii: "Services", galerie: "Gallery", zone: "Areas", blog: "Blog", recenzii: "Reviews", contact: "Contact" },
      hero: {
        badge: "AGFR Authorized • 16+ years experience",
        h1: "Fridge broken down?", h1b: "We repair it at your home.",
        sub: "Certified, authorized fridge repair technician — fridges, fridge-freezers and freezers. Fast response in Bucharest and surrounding areas.",
        cta1: "Call Now",
        badges: ["12-month warranty", "Fiscal invoice", "Original parts", "Call-out fee 70 RON"],
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
          { n: "1", title: "Call or send WhatsApp", desc: "Contact us at +40 737 444 337, describe the problem and we'll set a convenient time." },
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
        title: "What Clients Say", sub: "16+ years of fridge repairs in Bucharest",
        mapTitle: "Our Location",
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
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>{t.process.note}</p>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "48px" }}>
            {reviewItems.map((r, i) => (
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
