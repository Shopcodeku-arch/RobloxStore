import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS, Product } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'transaksi' | 'keterangan'>('transaksi');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [username, setUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<{ id: number; name: string; displayName: string; avatar: string } | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Add font awesome link dynamically since it was in head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(font);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(font);
    };
  }, []);

  // Simulated countdown
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        return;
      }
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeRemaining({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Simulate product loading skeleton
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 5000); // 5 seconds simulated delay
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (val: string) => {
    const noSpaceVal = val.replace(/\s/g, '');
    setUsername(noSpaceVal);
    setVerifiedUser(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (noSpaceVal.length < 3) {
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    debounceRef.current = setTimeout(() => {
      verifyRobloxUser(noSpaceVal);
    }, 800);
  };

  const verifyRobloxUser = async (val: string) => {
    try {
      const userRes = await fetch(`https://roblox-checker.tokoardanapi.workers.dev?username=${encodeURIComponent(val)}`);
      const userData = await userRes.json();
      
      if (userRes.ok && userData.success) {
          setVerifiedUser({
              id: userData.userId,
              name: userData.username,
              displayName: userData.nickname || userData.username,
              avatar: userData.avatarUrl || "https://i.ibb.co.com/vH9J0yT0/default-avatar.png"
          });
      } else {
         setVerifiedUser(null);
      }
    } catch (e) {
      console.error("Error verifying Roblox user:", e);
      setVerifiedUser(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId);

  const handleOrder = () => {
    if (!verifiedUser || !selectedProduct) return;
    if (!orderName.trim() || !orderEmail.trim()) {
      alert('Nama dan Email wajib diisi!');
      return;
    }
    
    const now = new Date();
    const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const message = `Halo Admin, saya mau order:\n\n*Nama:* ${orderName}\n*Email:* ${orderEmail}\n*Id Transaksi:* ${transactionId}\n*Waktu:* ${dateString}\n*Username Roblox:* ${verifiedUser.name} (${verifiedUser.displayName})\n*Order:* ${selectedProduct.name}\n*Harga:* Rp ${selectedProduct.price.toLocaleString('id-ID')}\n\nMohon diproses.`;
    window.open(`https://wa.me/6285832939049?text=${encodeURIComponent(message)}`, '_blank');
    setIsConfirmOpen(false);
  };

  const flashProducts = PRODUCTS.filter(p => p.type === 'flash');
  const hematProducts = PRODUCTS.filter(p => p.type === 'first');
  const premiumProducts = PRODUCTS.filter(p => p.type === 'special');
  const regularProducts = PRODUCTS.filter(p => p.type === 'regular');

  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

  return (
    <>
      <div className="overlay" style={{ display: isConfirmOpen ? 'flex' : 'none' }}>
        <div className="popup">
          {isProcessingOrder ? (
            <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div className="loader"></div>
               <div className="processing-text">Proses...</div>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Konfirmasi Pesanan</h3>
              
              {verifiedUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-body)', padding: '8px', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={verifiedUser.avatar} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {verifiedUser.displayName}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>@{verifiedUser.name}</span>
                    </div>
                </div>
              )}

          <div style={{ background: 'var(--bg-body)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></span>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Masukkan Nama" 
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  style={{ marginBottom: '2px', padding: '8px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Alamat Email <span style={{ color: '#ef4444' }}>*</span></span>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="Masukkan Email" 
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  style={{ marginBottom: '2px', padding: '8px' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Id Transaksi</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>{transactionId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Waktu</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Username Roblox</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>{verifiedUser?.name}</span>
            </div>
            <hr style={{ borderColor: 'var(--border-color)', margin: '5px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Item</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>{selectedProduct?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Harga</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)' }}>{selectedProduct ? formatPrice(selectedProduct.price) : 'Rp 0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Pembayaran</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>Transfer / Qris</span>
            </div>
          </div>
          
          <div className="btn-group" style={{ marginTop: '15px' }}>
            <button className="btn-no" onClick={() => setIsConfirmOpen(false)}>Batal</button>
            <button className="btn-yes" onClick={handleOrder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
               <i className="fa-brands fa-whatsapp"></i> Lanjut WhatsApp
            </button>
          </div>
          </>
          )}
        </div>
      </div>

      <div className="game-header">
        <img src="https://i.ibb.co.com/pvVzdhsF/rblxtopup.webp" className="game-bg" alt="Background Roblox" />
        <div className="header-content">
          <img src="https://iili.io/fSN5CSs.th.png" className="game-icon" alt="Roblox" />
          <div className="game-text">
            <h3>Roblox</h3>
            <p>Pengalaman Virtual!</p>
            <div className="badges">
              <span className="badge"><i className="fa-solid fa-bolt" style={{ color: '#facc15' }}></i> Instant</span>
              <span className="badge"><i className="fa-solid fa-shield-halved" style={{ color: '#60a5fa' }}></i> Aman</span>
              <span className="badge"><i className="fa-solid fa-circle-check" style={{ color: '#90EE90' }}></i> Bergaransi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-box">
        <div className={`tab-item ${activeTab === 'transaksi' ? 'active' : ''}`} onClick={() => setActiveTab('transaksi')}>Transaksi</div>
        <div className={`tab-item ${activeTab === 'keterangan' ? 'active' : ''}`} onClick={() => setActiveTab('keterangan')}>Keterangan</div>
      </div>

      <div style={{ display: activeTab === 'transaksi' ? 'block' : 'none' }}>
        
        <div className="section-box">
          <div className="num-label"><span className="num-circle">1</span> Masukkan Username</div>
          
          <div className="input-group" style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Masukkan Username Roblox" 
              value={username}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete="off" 
            />
            <div className="loader-spin" style={{ display: isVerifying ? 'block' : 'none' }}></div>
          </div>
          
          <span className="helper-text">Contoh: TokoArdan_Gamer (Tanpa @)</span>

          <div className="user-check-result" style={{ display: verifiedUser ? 'flex' : 'none', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {verifiedUser ? <img src={verifiedUser.avatar} className="user-avatar-img" alt="Avatar" /> : <div className="user-avatar-img"></div>}
            </div>
            <div>
               <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                 {verifiedUser?.displayName || 'Username'}
               </div>
               <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>@{verifiedUser?.name || '-'}</div>
               <div className="valid-badge"><i className="fa-solid fa-circle-check"></i> Terverifikasi Oleh TOKOARDAN</div>
            </div>
          </div>
        </div>

        <div style={{ margin: '0 20px 20px', position: 'relative' }}>
          <div className="num-label" style={{ position: 'static', display: 'inline-flex', width: 'auto', borderRadius: '8px' }}>
            <span className="num-circle">2</span> Pilih Nominal
          </div>
        </div>

        <div className="tabs-scrollable">
           {['Semua', 'Robux Instan', 'Roblox 1-5 Hari', 'Roblox Gift Card'].map(cat => (
              <div 
                key={cat} 
                className={`tab-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                 {cat}
              </div>
           ))}
        </div>

        {(activeCategory === 'Semua' || activeCategory === 'Robux Instan') && (
            <>
                <div className="cat-title"> Robux Instan (1-5 Menit)</div>
                <div className="normal-grid">
                   {isLoadingProducts ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="skeleton sk-card">
                            <div className="sk-card-img"></div>
                            <div className="sk-fs-content">
                                <div className="sk-line"></div>
                                <div className="sk-line short"></div>
                            </div>
                        </div>
                      ))
                   ) : (
                      hematProducts.map(p => (
                        <div key={p.id} className={`card-item ${selectedProductId === p.id ? 'selected' : ''}`} onClick={() => setSelectedProductId(p.id)}>
                           <div className="check-mark"><i className="fa-solid fa-check"></i></div>
                           <img src={p.icon} className="card-img" alt="" />
                           <div>
                               <div className="card-name" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                               <div className="card-price">Rp {p.price.toLocaleString('id-ID')}</div>
                           </div>
                        </div>
                      ))
                   )}
                </div>
            </>
        )}

        {(activeCategory === 'Semua' || activeCategory === 'Roblox 1-5 Hari') && (
            <>
                <div className="cat-title"> Top Up Robux (Pass 1-5 Hari)</div>
                <div className="normal-grid">
                   {isLoadingProducts ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="skeleton sk-card">
                            <div className="sk-card-img"></div>
                            <div className="sk-fs-content">
                                <div className="sk-line"></div>
                                <div className="sk-line short"></div>
                            </div>
                        </div>
                      ))
                   ) : (
                      regularProducts.map(p => (
                        <div key={p.id} className={`card-item ${selectedProductId === p.id ? 'selected' : ''}`} onClick={() => setSelectedProductId(p.id)}>
                           <div className="check-mark"><i className="fa-solid fa-check"></i></div>
                           <img src={p.icon} className="card-img" alt="" />
                           <div>
                               <div className="card-name" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                               <div className="card-price">Rp {p.price.toLocaleString('id-ID')}</div>
                           </div>
                        </div>
                      ))
                   )}
                </div>
            </>
        )}

        {(activeCategory === 'Semua' || activeCategory === 'Roblox Gift Card') && (
            <>
                <div className="cat-title"> Premium & Gift (ViaLog/Online/Code)</div>
                <div className="normal-grid">
                   {isLoadingProducts ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="skeleton sk-card">
                            <div className="sk-card-img"></div>
                            <div className="sk-fs-content">
                                <div className="sk-line"></div>
                                <div className="sk-line short"></div>
                            </div>
                        </div>
                      ))
                   ) : (
                      premiumProducts.map(p => (
                        <div key={p.id} className={`card-item ${selectedProductId === p.id ? 'selected' : ''}`} onClick={() => setSelectedProductId(p.id)}>
                           <div className="check-mark"><i className="fa-solid fa-check"></i></div>
                           <img src={p.icon} className="card-img" alt="" />
                           <div>
                               <div className="card-name" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                               <div className="card-price">Rp {p.price.toLocaleString('id-ID')}</div>
                           </div>
                        </div>
                      ))
                   )}
                </div>
            </>
        )}
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <a href="https://topupardan.my.id" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <img src="https://i.ibb.co.com/svVZsK0Z/1779806185508-em1-DA7-Proyek-Baru-22-FD03-CB4-removebg-preview-removebg-preview.png" alt="Icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                Ingin TopUp game lain? KLIK DISINI
            </a>
        </div>
        
        <div className="copyright-text">
            <i className="fa-solid fa-circle-check" style={{ color: '#facc15', marginRight: '2px' }}></i> <strong>TOKOARDAN All <strong>Rights Reserved<br/></strong></strong>
            Made with for Community<br/>
            <div className="loader-eyes"></div>
        </div>
      </div>

      <div style={{ display: activeTab === 'keterangan' ? 'block' : 'none' }}>
        <div className="info-box">
            <div className="info-title">Cara Pemesanan</div>
            <ol className="step-list">
                <li>Masukkan <strong>Username Roblox</strong> Anda (Tunggu sampai terverifikasi)</li>
                <li>Pilih nominal Robux yang Anda inginkan</li>
                <li>Klik tombol <strong>"Pesan Sekarang"</strong> di bagian bawah</li>
                <li>Anda akan diarahkan ke <strong>WhatsApp Admin</strong></li>
                <li>Kirim format pesan yang sudah otomatis terisi</li>
            </ol>
        </div>

        <div className="info-box">
            <div className="info-title">FAQ (Tanya Jawab)</div>
            <details>
                <summary>Apa Itu Pass?</summary>
                <p>Pass Roblox adalah item digital (Game Pass) di dalam game Roblox yang memberi keuntungan khusus kepada pemain. Pass hanya bisa digunakan pada game yang mendukungnya dan biasanya bersifat permanen :)</p>
            </details>
            <details>
                <summary>Berapa lama prosesnya?</summary>
                <p>Proses top up biasanya instan (5-10 menit) setelah pembayaran dikonfirmasi :)</p>
            </details>
            <details>
                <summary>Apa Itu ViaLog?</summary>
                <p>ViaLog adalah sistem pengiriman digital yang mencatat dan menampilkan status proses transaksi secara real-time, sehingga pengguna dapat memantau pesanan dengan transparan dan aman :)</p>
            </details>
            <details>
                <summary>Takut Kena Scam?</summary>
                <p>
                Tenang saja, TokoArdan terbebas dari scam dan menyediakan item resmi dari Indonesia :)
                <br/>
                WhatsApp Admin: 
                <a href="https://wa.me/6285832939049" target="_blank" style={{ color: '#25D366', textDecoration: 'none' }}>
                <i className="fa-brands fa-whatsapp"></i> 0858-3293-9049
                </a>
                </p>
            </details>
            <details>
                <summary>Apa Itu Item Online?</summary>
                <p>Item online adalah item yang akan kami gift/trade lewat map langsung setelah pembayaran terkonfirmasi :)</p>
            </details>
        </div>
      </div>

      <div className={`footer-bar ${selectedProductId && activeTab === 'transaksi' ? 'show' : ''}`} style={{ transform: selectedProductId && activeTab === 'transaksi' ? 'translateY(0)' : 'translateY(100%)' }}>
        <div>
            <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>Total Pembayaran</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>
              {selectedProduct ? formatPrice(selectedProduct.price) : 'Rp 0'}
            </div>
        </div>
        <button className="btn-buy" onClick={() => {
            const trId = 'TRX-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
            setTransactionId(trId);
            setIsConfirmOpen(true);
            setIsProcessingOrder(true);
            setTimeout(() => {
                setIsProcessingOrder(false);
            }, 1500);
        }} disabled={!verifiedUser || !selectedProductId}>
          {!selectedProductId ? 'Pilih Item' : (!verifiedUser ? 'Cek Username...' : 'Pesan Sekarang')}
        </button>
      </div>
    </>
  );
}
