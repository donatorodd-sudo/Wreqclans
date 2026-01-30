// script.js - W-REQ CLANS PROXY VERSION
const MY_API_KEY = "5.47.168.106"; // Kendi Token'ını tırnak içine yaz
const CLAN_TAGS = ["#2QRGLRGG9", "#2PUJVQ898", "#YJJ8YLUJ"]; 

async function fetchClans() {
    const container = document.getElementById('clan-container');
    const status = document.getElementById('status');
    let allClans = [];

    // CORS Engelini Aşmak İçin Proxy Kullanıyoruz
    const proxyUrl = "https://api.allorigins.win/get?url=";

    for (let tag of CLAN_TAGS) {
        try {
            const targetUrl = `https://api.clashofclans.com/v1/clans/${encodeURIComponent(tag)}`;
            const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
            const json = await response.json();
            
            // Veri JSON formatına çevriliyor
            const data = JSON.parse(json.contents);

            if (data && data.memberList) {
                const totalDonations = data.memberList.reduce((acc, m) => acc + m.donations, 0);
                allClans.push({ ...data, totalDonations });
            }
        } catch (e) {
            console.error("Hata:", tag, e);
        }
    }

    // Bağışa göre sırala
    allClans.sort((a, b) => b.totalDonations - a.totalDonations);

    // Listeyi Ekrana Bas
    container.innerHTML = allClans.map((clan, index) => {
        const isMyClan = clan.tag === "#2QRGLRGG9";
        return `
            <div class="bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/5 ${isMyClan ? 'pasa-row' : ''} mb-4">
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
                        <p class="text-[9px] text-gray-600 uppercase">Donation</p>
                        <p class="text-blue-500 font-black text-xl italic">${clan.totalDonations.toLocaleString()}</p>
                    </div>
                </div>
                <div class="hidden bg-white/5 p-2 grid grid-cols-1 md:grid-cols-2 gap-px">
                    ${clan.memberList.sort((a,b) => b.donations - a.donations).slice(0, 15).map(m => `
                        <div class="bg-black p-3 flex justify-between items-center border-b border-white/[0.02]">
                            <span class="text-xs font-bold text-gray-300">
                                ${m.role === 'leader' ? '👑' : (m.role === 'coLeader' ? '⭐' : '👤')} ${m.name}
                            </span>
                            <span class="text-xs font-black text-blue-400">${m.donations.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    status.innerText = "VERİLER GÜNCEL";
    status.className = "text-[10px] font-bold text-green-500 uppercase";
}

fetchClans();
