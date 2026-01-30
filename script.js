// script.js
const MY_API_KEY = "5.47.166.16"; // Kendi key'ini tırnak içine yaz
const CLAN_TAGS = ["#2QRGLRGG9", "#2PUJVQ898", "#YJJ8YLUJ"]; // Sıralanacak klanlar

// Rol Sembolleri
function getRoleIcon(role) {
    const icons = {
        'leader': '👑',
        'coLeader': '⭐',
        'admin': '🛡️',
        'member': '👤'
    };
    return icons[role] || '👤';
}

async function fetchClans() {
    const container = document.getElementById('clan-container');
    const status = document.getElementById('status');
    let allClans = [];

    for (let tag of CLAN_TAGS) {
        try {
            // Tarayıcıdan doğrudan API çekmek için proxy katmanı (CORS hatasını önler)
            const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.clashofclans.com/v1/clans/${encodeURIComponent(tag)}`)}`;
            const response = await fetch(proxy, {
                headers: { 'Authorization': `Bearer ${MY_API_KEY}` }
            });
            const json = await response.json();
            const data = JSON.parse(json.contents);

            if (data && data.memberList) {
                const totalDonations = data.memberList.reduce((acc, m) => acc + m.donations, 0);
                allClans.push({ ...data, totalDonations });
            }
        } catch (e) { console.error("Veri hatası:", tag); }
    }

    // Bağışa göre sırala
    allClans.sort((a, b) => b.totalDonations - a.totalDonations);

    // Listeyi Oluştur
    container.innerHTML = allClans.map((clan, index) => {
        const isMyClan = clan.tag === "#2QRGLRGG9";
        return `
            <div class="clan-card ${isMyClan ? 'pasa-row' : ''} bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/5">
                <div class="p-5 flex justify-between items-center cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
                    <div class="flex items-center gap-4">
                        <span class="text-gray-700 font-black text-xs">${index + 1}</span>
                        <img src="${clan.badgeUrls.small}" class="w-12 h-12">
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 class="font-bold text-sm uppercase">${clan.name}</h2>
                                ${isMyClan ? '<span class="pasa-tag">PAŞA</span>' : ''}
                            </div>
                            <p class="text-[10px] text-gray-500 font-bold">${clan.tag} • Level ${clan.clanLevel}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[9px] text-gray-600 font-black uppercase tracking-widest">Donation</p>
                        <p class="text-blue-500 font-black text-xl italic">${clan.totalDonations.toLocaleString()}</p>
                    </div>
                </div>
                
                <div class="member-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 hidden">
                    ${clan.memberList.sort((a,b) => b.donations - a.donations).map(m => `
                        <div class="bg-black p-4 flex justify-between items-center border-b border-white/[0.02]">
                            <div class="flex items-center gap-3">
                                <span class="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">${m.expLevel}</span>
                                <div>
                                    <p class="text-xs font-bold">${getRoleIcon(m.role)} ${m.name}</p>
                                    <p class="text-[8px] text-gray-600 uppercase font-black">${m.role.replace('coLeader','Y. Lider').replace('admin','Büyük')}</p>
                                </div>
                            </div>
                            <span class="text-xs font-black text-blue-400">${m.donations.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    status.innerText = "VERİLER GÜNCEL";
    status.className = "text-[10px] font-bold text-green-500 uppercase tracking-widest";
}

fetchClans();
