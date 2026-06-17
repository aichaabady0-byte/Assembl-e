/* ==========================================
   1. STRUCTURE DE PAGE GLOBALE & FOND FLOU
   ========================================== */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
}

body {
    min-height: 100vh;
    width: 100vw;
    background: #020617;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
}

body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://kansascityfwc26.com/wp-content/uploads/2023/05/brand_reveal.jpg') no-repeat center center;
    background-size: cover;
    filter: blur(8px) brightness(0.35);
    transform: scale(1.05);
    z-index: -1;
}

.page-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
}

/* ==========================================
   2. PANNEAU DE SCORE PRINCIPAL (LIVE)
   ========================================== */
.main-scoreboard {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 32px;
    padding: 3.5rem;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
    position: relative;
}

.board-header { text-align: center; margin-bottom: 2rem; }
.logo-container { display: flex; justify-content: center; margin-bottom: 1rem; }
.fifa-logo { max-width: 130px; height: auto; filter: drop-shadow(0 0 15px rgba(255,255,255,0.1)); }
.board-subtitle { font-size: 0.9rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 0.3rem; }
#country-slogan { font-size: 2.4rem; font-weight: 800; color: #ffffff; }
.board-divider { border: 0; height: 1px; background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.1) 50%, rgba(255,255,255,0)); margin: 2rem 0 3rem 0; }

.scores-container { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.score-card { background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03); padding: 2.5rem; border-radius: 24px; transition: border-color 0.4s ease; }
.team-header { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.5rem; text-align: left; }
.team-flag { width: 75px; height: 46px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); }
.card-title { font-size: 1.6rem; color: #ffffff; font-weight: 800; }
.team-slogan { font-size: 0.9rem; color: #94a3b8; margin-top: 0.1rem; }
.score-display { font-family: 'Orbitron', sans-serif; font-size: 7rem; font-weight: 900; text-align: center; background: rgba(0, 0, 0, 0.4); padding: 0.8rem 0; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.04); transition: all 0.4s ease; }

/* ÉTAT "AUCUN MATCH DISPONIBLE" */
.no-match-message {
    text-align: center;
    padding: 4rem 2rem;
}
.no-match-message i { font-size: 4rem; color: #64748b; margin-bottom: 1.5rem; display: inline-block; animation: pulse 2s infinite; }
.no-match-message h2 { font-size: 2.2rem; color: #ffffff; font-weight: 800; margin-bottom: 0.5rem; }
.no-match-message p { color: #94a3b8; font-size: 1.1rem; }

@keyframes pulse {
    0% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 0.6; }
}

/* ==========================================
   3. DESIGN DES CHRONOS DIGITAUX ANIMÉS
   ========================================== */
.digital-clock { display: inline-flex; align-items: center; gap: 0.25rem; background: rgba(0, 0, 0, 0.45); padding: 0.35rem 0.75rem; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.2); box-shadow: 0 0 15px rgba(245, 158, 11, 0.08); vertical-align: middle; }
.clock-digit { position: relative; display: inline-block; width: 22px; height: 34px; line-height: 34px; text-align: center; font-family: 'Orbitron', monospace; font-size: 1.3rem; font-weight: 900; color: #f59e0b; background: #020617; border-radius: 6px; overflow: hidden; }
.clock-sep { font-family: 'Orbitron', monospace; font-size: 0.95rem; font-weight: 700; color: #d97706; padding: 0 0.1rem; }
@keyframes slideDigitDown { 0% { transform: translateY(-100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
.digit-animate { animation: slideDigitDown 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards; }

/* ==========================================
   4. ZONE DES ARCHIVES (EN BAS)
   ========================================== */
.archive-section { display: flex; flex-direction: column; gap: 1.5rem; }
.archive-title { display: flex; align-items: center; gap: 12px; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; }
.archive-title i { font-size: 1.5rem; color: #3b82f6; }
.archive-title h2 { font-size: 1.4rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

.archive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
.no-archives { color: #64748b; font-style: italic; font-size: 0.95rem; grid-column: 1 / -1; }

/* CARTE DE MATCH ARCHIVÉ */
.archive-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 18px;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    position: relative;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
.archive-card-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 0.5rem; }
.archive-duration { background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid rgba(34,197,94,0.15); font-family: 'Orbitron', monospace; }
.archive-teams-row { display: flex; align-items: center; justify-content: space-between; margin: 0.2rem 0; }
.archive-team { display: flex; align-items: center; gap: 0.6rem; width: 40%; }
.archive-team.left { justify-content: flex-start; text-align: left; }
.archive-team.right { justify-content: flex-end; text-align: right; flex-direction: row-reverse; }
.archive-flag { width: 36px; height: 22px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
.archive-team-name { font-size: 1rem; color: #ffffff; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.archive-score-center { font-family: 'Orbitron', sans-serif; font-size: 1.6rem; font-weight: 900; background: #020617; padding: 0.2rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); letter-spacing: 2px; }

/* ==========================================
   5. PANNEAU PANORAMIQUE ADMIN (MODALE)
   ========================================== */
.admin-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2, 6, 23, 0.92); backdrop-filter: blur(15px); z-index: 100; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
.admin-overlay.open { opacity: 1; visibility: visible; }
.admin-box { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08); width: 100%; max-width: 800px; border-radius: 24px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; max-height: 90vh; }
.admin-header { background: #1e293b; padding: 1.2rem 2rem; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 23px; border-top-right-radius: 23px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.admin-header h2 { color: #ffffff; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }
.btn-close { background: none; border: none; color: #94a3b8; font-size: 2rem; cursor: pointer; }
.btn-close:hover { color: #ffffff; }
.admin-body { padding: 2rem; overflow-y: auto; }

/* Barre de switch de statut */
.admin-status-bar { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 1.5rem; gap: 1rem; }
.status-control { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
.select-status { background: #0f172a; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; padding: 0.5rem; border-radius: 8px; outline: none; font-weight: bold; cursor: pointer; }
.select-status:focus { border-color: #3b82f6; }
.btn-archive-trigger { background: #e11d48; color: white; border: none; padding: 0.6rem 1.2rem; font-weight: 700; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; transition: background 0.2s; }
.btn-archive-trigger:hover { background: #be123c; }

.admin-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; }
.admin-col { background: #1e293b; padding: 1.25rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.02); }
.admin-col h3 { color: #ffffff; font-size: 1rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.4rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;}

.input-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; position: relative; }
.input-group label { color: #94a3b8; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.input-group input { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.65rem 0.85rem; border-radius: 8px; color: #ffffff; font-size: 0.9rem; outline: none; width: 100%; }
.input-group input:focus { border-color: #3b82f6; }
.input-group-row { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
input[type="color"] { height: 38px; padding: 2px; cursor: pointer; }

.btn-save { width: 100%; background: #3b82f6; color: #ffffff; border: none; padding: 0.9rem; font-weight: 700; font-size: 1rem; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-top: 1.5rem; }
.btn-save:hover { background: #2563eb; }

.toolbar { display: flex; gap: 0.3rem; position: absolute; right: 5px; top: -2px; }
.btn-format { background: #334155; border: none; color: #f8fafc; padding: 0.15rem 0.4rem; font-size: 0.7rem; border-radius: 4px; cursor: pointer; }
.btn-format:hover { background: #475569; color: #3b82f6; }

.admin-help-box { background: rgba(30, 41, 59, 0.4); border: 1px dashed rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 1rem; margin-top: 1.5rem; text-align: left; }
.admin-help-box h4 { color: #3b82f6; font-size: 0.85rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 5px; }
.admin-help-box ul { list-style: none; padding-left: 0.2rem; }
.admin-help-box li { color: #cbd5e1; font-size: 0.75rem; line-height: 1.4; margin-bottom: 0.3rem; }
.admin-help-box code { background: #0f172a; padding: 0.1rem 0.3rem; border-radius: 4px; color: #f43f5e; font-family: monospace; font-size: 0.8rem; }

/* Hide helper */
.hidden { display: none !important; }

/* ==========================================
   6. RESPONSIVE COMPACT MEDIAQUERIES
   ========================================== */
@media (max-width: 992px) {
    .page-container { gap: 2rem; padding: 1.5rem 1rem; }
    .main-scoreboard { padding: 2rem; border-radius: 24px; }
    #country-slogan { font-size: 1.8rem; }
    .scores-container { grid-template-columns: 1fr; gap: 1.5rem; }
    .score-card { padding: 1.5rem; }
    .score-display { font-size: 5rem; }
    .archive-grid { grid-template-columns: 1fr; }
}

@media (max-width: 576px) {
    body::before { filter: blur(12px) brightness(0.28); }
    .main-scoreboard { padding: 1.25rem; border-radius: 16px; }
    #country-slogan { font-size: 1.35rem; }
    .team-header { flex-direction: column; text-align: center; gap: 0.6rem; }
    .team-flag { width: 64px; height: 40px; }
    .card-title { font-size: 1.25rem; }
    .admin-box { width: 95%; }
    .admin-body { padding: 1.25rem; }
    .admin-columns { grid-template-columns: 1fr; }
    .admin-status-bar { flex-direction: column; align-items: stretch; }
    .btn-archive-trigger { justify-content: center; }
}
