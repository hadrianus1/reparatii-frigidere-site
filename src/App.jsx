import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import {
  FaPhone, FaWhatsapp, FaCheck, FaTrash, FaEdit,
  FaStar, FaRegStar, FaChevronDown, FaChevronLeft, FaChevronRight,
  FaReply, FaPlus, FaTimes, FaEye, FaEyeSlash,
  FaMapMarkerAlt, FaShieldAlt, FaTools,
  FaThermometerHalf, FaWind, FaBolt, FaMicrochip, FaSnowflake,
  FaThumbsUp, FaThumbsDown, FaHeart, FaUpload, FaImages,
} from "react-icons/fa";

// ===== GALLERY IMAGES (proxied through server to bypass hotlink protection) =====

const px = u => '/api/img-proxy?url=' + encodeURIComponent(u);

const GALLERY = [
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere_1_0.jpeg?itok=irvDHNu2"), caption: "Reparație frigider la domiciliu" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/repar_frigidere_opris_adrian.jpg?itok=vE6MDYnw"), caption: "Opris Adrian — Tehnician autorizat AGFR" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20200608_065349.jpg?itok=jSJbUVjY"), caption: "Service frigider Bosch" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20191016_122313.jpg?itok=8DUwT66E"), caption: "Reparație frigider Gorenje" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20200619_045619.jpg?itok=KzHZCIN2"), caption: "Reparație combine frigorifică Whirlpool" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20200620_072828.jpg?itok=kChTdYnp"), caption: "Schimb compresor frigider Arctic" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere-_opris_adrian.jpg?itok=So5TbVeZ"), caption: "Reparație frigider Beko" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20200401_211609.jpg?itok=Qn0RMyuF"), caption: "Service Hotpoint Ariston" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20200924_040354.jpg?itok=Iigiwq5N"), caption: "Reparație frigider Indesit" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere_ariston_hotpoint_2_2.jpeg"), caption: "Service Ariston Hotpoint — piese originale" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere_cu_pierdere_freon_0.jpeg"), caption: "Reparație pierdere freon frigider" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/opris_adrian_-_reparatii_frigidere.jpg"), caption: "Opris Adrian PFA — 16+ ani experiență" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatie_pierdere_freon_frigider_arctic.jpg"), caption: "Reparație pierdere freon Arctic" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere_no_frost_-_opeis_adrian.jpg"), caption: "Reparații frigidere No Frost" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere_hotpoint_ariston.jpeg"), caption: "Service Hotpoint Ariston București" },
  { url: px("https://www.reparatii-frigidere.com/sites/default/files/styles/poze_frigidere_mici/public/gallery/reparatii_frigidere_2.jpeg"), caption: "Intervenție rapidă în toată București" },
  { url: px("https://www.frigidere-reparatii.ro/sites/default/files/styles/poze_frigidere_mici/public/gallery/img_20200401_132345.jpg?itok=NnizZTkp"), caption: "Diagnosticare și reparare la client" },
];

// ===== HELPERS =====

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
      ? "Reparații Frigidere București | Opris Adrian PFA | 0737 444 337"
      : "Fridge Repair Bucharest | Opris Adrian PFA | 0737 444 337";
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
    setReplyTo(null); setCommentText(""); setCommentUsername("");
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
        showToast(editingPost ? "Articol actualizat!" : "Articol creat!");
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
        h1b: "Reparăm la domiciliu.",
        sub: "Tehnicieni autorizați pentru frigidere, combine frigorifice și congelatoare. Intervenție rapidă în toată București.",
        cta1: "Sună Acum", cta2: "WhatsApp",
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
          { n: "1", title: "Suni sau trimiți WhatsApp", desc: "Ne contactezi la 0737 444 337, descrii problema și stabilim o oră convenabilă." },
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
        sectorsDesc: "Intervenim în toate cele 6 sectoare ale Bucureștiului, de la Sector 1 (Floreasca, Dorobanți, Aviației) până la Sector 6 (Militari, Drumul Taberei, Crângași).",
        neighborhoods: "Cartiere principale",
        neighborhoodsDesc: "Militari, Drumul Taberei, Titan, Berceni, Pantelimon, Colentina, Floreasca, Dorobanți, Aviației, Pipera, Rahova, Ferentari, Giulești, Crângași, Văcărești, Tineretului, Dristor, Vitan, Iancului, Obor, Grivița, Băneasa, Otopeni.",
        suburbs: "Localități limitrofe",
        suburbsDesc: "Bragadiru, Domești, Clinceni, Măgurele, Militari Residence, Chiajna, Roșu, Cornetu.",
        seoText: "Serviciile noastre de reparații frigidere acoperă întreaga arie metropolitană a Bucureștiului. Indiferent dacă locuiești în sectorul 1, 2, 3, 4, 5 sau 6, sau în localitățile limitrofe, tehnicianul nostru autorizat ajunge la tine rapid.",
      },
      reviews: {
        title: "Ce spun clienții", sub: "Peste 500 de reparații efectuate în București",
        mapTitle: "Locația noastră", writeReview: "Lasă o recenzie pe Google",
        items: [
          { name: "Maria Constantin", zone: "Sector 1", rating: 5, text: "Servicii excelente! Frigiderul Bosch a fost reparat în aceeași zi. Tehnicianul a fost profesionist, a explicat tot ce a făcut și a lăsat totul curat. Prețul a fost corect.", date: "Octombrie 2025" },
          { name: "Ion Marinescu", zone: "Militari", rating: 5, text: "Am sunat dimineața și au venit după-amiaza. Frigiderul Arctic nu mai răcea deloc — probleme cu freonul. L-au rezolvat rapid, garanție 12 luni, factură fiscală.", date: "Septembrie 2025" },
          { name: "Elena Popescu", zone: "Drumul Taberei", rating: 5, text: "Am apelat de urgență pentru combinele frigorifica Whirlpool. Opris Adrian a venit în 2 ore, a diagnosticat problema (compresor defect) și l-a schimbat pe loc.", date: "Iulie 2025" },
          { name: "Gheorghe Dumitrescu", zone: "Titan, Sector 3", rating: 5, text: "Profesionalism maxim. Am un frigider Samsung no-frost care nu mai producea gheață. A găsit problema, a adus piesa originală și l-a reparat. Mulțumit 100%!", date: "Iunie 2025" },
          { name: "Ana-Maria Stoica", zone: "Berceni, Sector 4", rating: 4, text: "Bun profesionist, prețuri corecte. A venit la timp, a reparat frigiderul Indesit fără probleme. Rezultatul final a fost excelent.", date: "Mai 2025" },
          { name: "Valentin Radu", zone: "Sector 6", rating: 5, text: "Al doilea frigider pe care mi-l repară în 2 ani. De fiecare dată: punctual, corect, calitate bună. Rămâne numărul meu 1 pentru astfel de probleme.", date: "Aprilie 2025" },
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
        showOf: "Se afișează", of: "din", articles: "articole",
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
        ],
      },
      contact: {
        title: "Contact", sub: "Sună acum și îți rezolvăm problema rapid",
        phone: "0737 444 337", phoneFull: "+40737444337",
        email: "adifrigotehnist@yahoo.com",
        address: "Bulevardul Timișoara 53, Sector 6, București",
        hours: "Luni – Sâmbătă: 09:00 – 18:00",
        copyright: "Opris Adrian PFA • CUI 26374475 • Toate drepturile rezervate.",
      },
    },
    en: {
      nav: { acasa: "Home", servicii: "Services", galerie: "Gallery", zone: "Areas", blog: "Blog", recenzii: "Reviews", contact: "Contact" },
      hero: {
        badge: "AGFR Authorized • 16+ years experience",
        h1: "Fridge broken down?", h1b: "We repair at your home.",
        sub: "Authorized technicians for fridges, fridge-freezers and freezers. Fast response across Bucharest.",
        cta1: "Call Now", cta2: "WhatsApp",
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
          { n: "1", title: "Call or send WhatsApp", desc: "Contact us at 0737 444 337, describe the problem and we'll set a convenient time." },
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
        sectorsDesc: "We serve all 6 sectors of Bucharest, from Sector 1 (Floreasca, Dorobanți, Aviației) to Sector 6 (Militari, Drumul Taberei, Crângași).",
        neighborhoods: "Main neighborhoods",
        neighborhoodsDesc: "Militari, Drumul Taberei, Titan, Berceni, Pantelimon, Colentina, Floreasca, Dorobanți, Aviației, Pipera, Rahova, Ferentari, Giulești, Crângași, Văcărești, Tineretului, Dristor, Vitan, Iancului, Obor, Grivița, Băneasa, Otopeni.",
        suburbs: "Surrounding areas",
        suburbsDesc: "Bragadiru, Domești, Clinceni, Măgurele, Militari Residence, Chiajna, Roșu, Cornetu.",
        seoText: "Our fridge repair services cover the entire Bucharest metropolitan area. Whether you live in sector 1, 2, 3, 4, 5, or 6, or in the surrounding towns, our authorized technician reaches you quickly.",
      },
      reviews: {
        title: "What Clients Say", sub: "Over 500 repairs completed in Bucharest",
        mapTitle: "Our Location", writeReview: "Leave a Google review",
        items: [
          { name: "Maria Constantin", zone: "Sector 1", rating: 5, text: "Excellent service! The Bosch fridge was repaired the same day. The technician was professional, explained everything and left everything clean.", date: "October 2025" },
          { name: "Ion Marinescu", zone: "Militari", rating: 5, text: "Called in the morning, they came in the afternoon. The Arctic fridge wasn't cooling at all — freon issue. Fixed quickly, 12-month warranty.", date: "September 2025" },
          { name: "Elena Popescu", zone: "Drumul Taberei", rating: 5, text: "Called as an emergency for a Whirlpool fridge-freezer. Adrian arrived in 2 hours, diagnosed a faulty compressor and replaced it on the spot.", date: "July 2025" },
          { name: "Gheorghe Dumitrescu", zone: "Titan, Sector 3", rating: 5, text: "Maximum professionalism. My Samsung no-frost fridge wasn't making ice. Found the problem, brought the original part and fixed it. 100% satisfied!", date: "June 2025" },
          { name: "Ana-Maria Stoica", zone: "Berceni, Sector 4", rating: 4, text: "Good professional, fair prices. Arrived on time, fixed the Indesit fridge without issues. The end result was excellent.", date: "May 2025" },
          { name: "Valentin Radu", zone: "Sector 6", rating: 5, text: "Second fridge he's repaired for me in 2 years. Every time: punctual, fair, good quality. My number one for appliance issues.", date: "April 2025" },
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
        showOf: "Showing", of: "of", articles: "articles",
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
        ],
      },
      contact: {
        title: "Contact", sub: "Call now and we'll fix your problem fast",
        phone: "0737 444 337", phoneFull: "+40737444337",
        email: "adifrigotehnist@yahoo.com",
        address: "Bulevardul Timișoara 53, Sector 6, Bucharest",
        hours: "Monday – Saturday: 09:00 – 18:00",
        copyright: "Opris Adrian PFA • CUI 26374475 • All rights reserved.",
      },
    },
  }[lang];

  const BRANDS = ["Bosch", "Samsung", "Whirlpool", "Electrolux", "Indesit", "Gorenje", "Beko", "Arctic", "Zanussi", "Grundig", "Hotpoint Ariston", "LG"];
  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
  const visiblePosts = (isAdmin ? posts : posts.filter(p => p.published)).slice(0, postsVisible);
  const totalPosts = isAdmin ? posts.length : posts.filter(p => p.published).length;
  const commentsForPost = (postId) => postComments[postId] || [];
  const rootComments = (postId) => commentsForPost(postId).filter(c => !c.parent_id);
  const childComments = (postId, parentId) => commentsForPost(postId).filter(c => c.parent_id === parentId);

  // ===== RENDER =====

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#1e293b", background: "#f8faff" }}>

      {/* ===== HEADER ===== */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: isScrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: isScrolled ? "1px solid #e2e8f0" : "none",
        transition: "all 0.3s", height: "68px",
        boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#acasa" onClick={() => setActiveNav("acasa")} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #0277bd, #29b6f6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "18px" }}>❄️</div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: "700", fontSize: "15px", color: "#0277bd", lineHeight: "1.1" }}>Reparații Frigidere</div>
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
              <FaPhone size={12} /> 0737 444 337
            </a>
            {isAdmin && (
              <button onClick={handleAdminLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>Admin ✕</button>
            )}
            <div style={{ display: "flex", gap: "4px" }}>
              {["ro", "en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: "none", border: "none", fontSize: "12px", fontWeight: lang === l ? "700" : "400", color: lang === l ? "#0277bd" : "#94a3b8", cursor: "pointer", textTransform: "uppercase" }}>{l}</button>
              ))}
            </div>
            <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)}><span /><span /><span /></button>
          </div>
        </div>

        <div className={`mobile-nav-overlay${menuOpen ? " open" : ""}`}>
          <a href="tel:+40737444337" style={{ background: "#0277bd", color: "white", borderRadius: "10px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <FaPhone /> 0737 444 337
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
          <div style={{ animation: "fadeInUp 0.7s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(41,182,246,0.15)", border: "1px solid rgba(41,182,246,0.3)", color: "#29b6f6", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "28px" }}>
              <FaShieldAlt size={11} /> {t.hero.badge}
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "56px", fontWeight: "700", color: "white", lineHeight: "1.1", marginBottom: "8px" }}>{t.hero.h1}</h1>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "56px", fontWeight: "700", color: "#29b6f6", lineHeight: "1.1", marginBottom: "24px" }}>{t.hero.h1b}</h1>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.75)", maxWidth: "560px", lineHeight: "1.7", marginBottom: "40px" }}>{t.hero.sub}</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
              <a href={`tel:${t.contact.phoneFull}`} style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#29b6f6", color: "#0d1b2a", padding: "16px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "16px", textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(41,182,246,0.4)", animation: "pulse 2.5s infinite" }}>
                <FaPhone size={16} /> {t.hero.cta1}: {t.contact.phone}
              </a>
              <a href="https://wa.me/40737444337" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#25d366", color: "white", padding: "16px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", textDecoration: "none" }}>
                <FaWhatsapp size={18} /> {t.hero.cta2}
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
      </section>

      {/* ===== SERVICES ===== */}
      <section id="servicii" className="section-pad" style={{ background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#0277bd", marginBottom: "12px" }}>Prețuri clare</div>
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
            {BRANDS.map(brand => (
              <div key={brand} style={{ background: "#f8faff", border: "1px solid #e2e8f0", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: "#475569", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e3f2fd"; e.currentTarget.style.color = "#0277bd"; e.currentTarget.style.borderColor = "#0277bd"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8faff"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>{brand}</div>
            ))}
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
              { icon: "🏙️", title: t.zones.sectors, desc: t.zones.sectorsDesc },
              { icon: "🏘️", title: t.zones.neighborhoods, desc: t.zones.neighborhoodsDesc },
              { icon: "🛣️", title: t.zones.suburbs, desc: t.zones.suburbsDesc },
            ].map((z, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{z.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0d1b2a", marginBottom: "10px" }}>{z.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>{z.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.8", background: "white", padding: "20px 24px", borderRadius: "12px", borderLeft: "4px solid #0277bd" }}>{t.zones.seoText}</p>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section id="recenzii" className="section-pad" style={{ background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "38px", fontWeight: "700", marginBottom: "12px", color: "#0d1b2a" }}>{t.reviews.title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>{t.reviews.sub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "48px" }}>
            {t.reviews.items.map((r, i) => (
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
            <div style={{ background: "#f0f7ff", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0d1b2a", marginBottom: "8px" }}>4.9 / 5.0</h3>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>{lang === "ro" ? "Bazat pe recenzii Google Maps" : "Based on Google Maps reviews"}</p>
              <a href="https://www.google.com/maps/search/Opris+Adrian+PFA+Reparatii+Frigidere+Bucuresti" target="_blank" rel="noopener noreferrer" className="btn-primary">{t.reviews.writeReview}</a>
            </div>
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
                  <img src={activeBlogPost.image_url} alt={activeBlogPost.title} style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "16px", marginBottom: "32px" }} />
                )}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                  <CategoryBadge cat={activeBlogPost.category} />
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>{formatDate(activeBlogPost.created_at)}</span>
                  {isAdmin && !activeBlogPost.published && <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>Nepublicat</span>}
                </div>
                <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "32px", fontWeight: "700", color: "#0d1b2a", marginBottom: "24px", lineHeight: "1.2" }}>{activeBlogPost.title}</h1>
                <div className="prose" dangerouslySetInnerHTML={{ __html: activeBlogPost.content.replace(/\n/g, "<br/>") }} />
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

                {rootComments(activeBlogPost.id).filter(c => c.approved || isAdmin).length === 0 ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", marginBottom: "32px" }}>{t.blog.noComments}</p>
                ) : (
                  rootComments(activeBlogPost.id).filter(c => c.approved || isAdmin).map(c => {
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
                {isAdmin && (
                  <button onClick={() => { setShowNewPostForm(true); setEditingPost(null); setPostForm({ title: "", excerpt: "", content: "", category: "General", image_url: "" }); }} className="btn-primary">
                    <FaPlus size={12} /> {t.blog.newArticle}
                  </button>
                )}
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
                          <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                        ) : (
                          <div style={{ height: "120px", background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>❄️</div>
                        )}
                        <div style={{ padding: "20px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                            <CategoryBadge cat={post.category} />
                            {isAdmin && !post.published && <span style={{ fontSize: "10px", background: "#fef2f2", color: "#dc2626", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>Draft</span>}
                          </div>
                          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0d1b2a", marginBottom: "10px", lineHeight: "1.3" }}>{post.title}</h3>
                          {post.excerpt && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", marginBottom: "16px" }}>{post.excerpt}</p>}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "48px" }}>
            {[
              { icon: "📞", label: lang === "ro" ? "Telefon" : "Phone", value: t.contact.phone, href: `tel:${t.contact.phoneFull}` },
              { icon: "💬", label: "WhatsApp", value: t.contact.phone, href: "https://wa.me/40737444337" },
              { icon: "📧", label: "Email", value: t.contact.email, href: `mailto:${t.contact.email}` },
              { icon: "⏰", label: lang === "ro" ? "Program" : "Hours", value: t.contact.hours, href: null },
              { icon: "📍", label: lang === "ro" ? "Adresă" : "Address", value: t.contact.address, href: null },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "#29b6f6", marginBottom: "6px" }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    style={{ fontSize: "14px", color: "white", textDecoration: "none", fontWeight: "500" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#29b6f6"}
                    onMouseLeave={e => e.currentTarget.style.color = "white"}>{item.value}</a>
                ) : (
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{item.value}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
            <a href={`tel:${t.contact.phoneFull}`} className="btn-primary" style={{ background: "#29b6f6", color: "#0d1b2a", fontSize: "16px", padding: "14px 32px" }}>
              <FaPhone size={15} /> {t.contact.phone}
            </a>
            <a href="https://wa.me/40737444337" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#25d366", color: "white", padding: "14px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", textDecoration: "none" }}>
              <FaWhatsapp size={18} /> WhatsApp
            </a>
          </div>
          <p onClick={() => !isAdmin && setShowAdminLogin(true)}
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", margin: 0, cursor: "default", userSelect: "none" }}>
            {t.contact.copyright}
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
