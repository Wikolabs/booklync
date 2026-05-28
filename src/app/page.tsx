export default function BookLync() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="font-bold text-purple-900 text-xl" style={{ fontFamily: "var(--font-display)" }}>BookLync</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-purple-600">
            <a href="#how" className="hover:text-purple-500 transition-colors">Comment ça marche</a>
            <a href="#features" className="hover:text-purple-500 transition-colors">Fonctionnalités</a>
            <a href="#proof" className="hover:text-purple-500 transition-colors">Preuves</a>
          </div>
          <a href="#cta" className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90">
            Remplir mon agenda
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            Prise de rendez-vous 100% automatisée
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-purple-950 leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Votre agenda rempli.<br />
            <span className="text-purple-500">Automatiquement.</span>
          </h1>
          <p className="text-purple-700 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            BookLync détecte l&apos;intention d&apos;achat, propose 3 créneaux adaptés, confirme le rendez-vous, envoie le brief pré-call et le rappel J-1 — sans que vous leviez le petit doigt.
          </p>

          {/* Calendar mock */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-purple-200 border border-purple-100 p-6 max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-purple-900" style={{ fontFamily: "var(--font-display)" }}>Juin 2025</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">3 créneaux proposés automatiquement</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-purple-400 mb-2">
              {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(d => <div key={d} className="py-1 font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(6)].map((_, i) => <div key={i} />)}
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const isBooked = [3, 8, 12, 17, 22, 26].includes(day);
                const isProposed = [10, 15, 19].includes(day);
                return (
                  <div key={day} className={`py-2 rounded-lg text-sm font-medium
                    ${isBooked ? "bg-purple-100 text-purple-600" : ""}
                    ${isProposed ? "bg-purple-500 text-white ring-2 ring-purple-300" : ""}
                    ${!isBooked && !isProposed ? "text-gray-400" : ""}
                  `}>{day}</div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500" /><span className="text-gray-500">Créneaux proposés</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-100" /><span className="text-gray-500">Réservés</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#cta" className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300">
              Remplir mon agenda →
            </a>
            <a href="#how" className="bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              Voir comment ça marche
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — horizontal steps */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-950 text-center mb-14" style={{ fontFamily: "var(--font-display)" }}>
            De l&apos;intention à la réunion en 4 minutes
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: "1", icon: "🎯", title: "Intention détectée", desc: "Visite page pricing, clic sur démo, engagement LinkedIn — BookLync repère les signaux chauds." },
              { n: "2", icon: "📅", title: "3 créneaux proposés", desc: "Un message personnalisé est envoyé avec 3 options dans votre calendrier, selon vos disponibilités réelles." },
              { n: "3", icon: "✅", title: "Confirmation automatique", desc: "Le prospect clique → invite Calendly créée, lien Zoom/Meet généré, confirmation email envoyée." },
              { n: "4", icon: "📋", title: "Brief & rappel J-1", desc: "La veille, BookLync envoie un brief contextualisé au prospect et un rappel dans votre Notion/CRM." },
            ].map((s) => (
              <div key={s.n} className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3" style={{ fontFamily: "var(--font-display)" }}>{s.n}</div>
                <h3 className="font-bold text-purple-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h3>
                <p className="text-purple-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-purple-950">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14" style={{ fontFamily: "var(--font-display)" }}>
            Tout ce qu&apos;il faut, sans les frictions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🔗", title: "Intégrations natives", desc: "Calendly, Google Calendar, Outlook, Zoom, Google Meet, HubSpot, Notion — branché en 1-clic.", color: "bg-purple-900/60 border-purple-700" },
              { icon: "🤖", title: "Messages personnalisés IA", desc: "Chaque message de prise de RDV est rédigé par l'IA selon le contexte du prospect et le canal.", color: "bg-violet-900/60 border-violet-700" },
              { icon: "📊", title: "Dashboard de conversion", desc: "Taux de clic sur les créneaux, taux de confirmation, no-show : tout est tracé et optimisé.", color: "bg-fuchsia-900/60 border-fuchsia-700" },
            ].map((f) => (
              <div key={f.title} className={`${f.color} border rounded-2xl p-7`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-3" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { value: "+65%", label: "de rendez-vous pris vs formulaire manuel" },
              { value: "< 4min", label: "entre intention et confirmation" },
              { value: "92%", label: "de taux de présence grâce aux rappels" },
            ].map((s) => (
              <div key={s.label} className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-4xl font-bold text-purple-600 mb-2" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
                <div className="text-purple-600 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-gradient-to-br from-purple-600 to-violet-700">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Votre agenda se remplit dès ce soir
          </h2>
          <p className="text-purple-200 text-xl mb-10">Connexion Calendly en 5 minutes. Premiers RDV automatiques aujourd&apos;hui.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-xl">
              📅 Réserver un créneau →
            </a>
            <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20BookLync%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-xl" style={{ background: "#25d366", borderColor: "#25d366" }}>
              💬 WhatsApp →
            </a>
          </div>
          <p className="text-purple-300 text-sm mt-5">Essai gratuit 14 jours. Aucune carte bancaire requise.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-purple-950 text-purple-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-white text-xl" style={{ fontFamily: "var(--font-display)" }}>BookLync</span>
          <p className="text-sm">© 2025 BookLync — Un produit <a href="https://wikolabs.com" className="text-purple-400 hover:text-purple-200">Wikolabs</a></p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="mailto:team@wikolabs.com" className="hover:text-purple-200 transition-colors">team@wikolabs.com</a>
            <span>·</span>
            <a href="tel:+261386626100" className="hover:text-purple-200 transition-colors">+261 38 66 261 00</a>
            <span>·</span>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition-colors">Prendre RDV</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
