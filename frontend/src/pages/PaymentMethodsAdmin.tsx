
import React, { useState, useEffect } from "react";
import { FaQrcode, FaUniversity, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { apiFetch } from "../utils/api";

const PaymentMethodsAdmin: React.FC = () => {
  const [qrs, setQrs] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  
  const [qrForm, setQrForm] = useState({ id: null, label: "", upi_id: "", is_active: true, image: null as File | null });
  const [bankForm, setBankForm] = useState({ id: null, bank_name: "", account_number: "", ifsc_code: "", holder_name: "", is_active: true });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qrRes, bankRes] = await Promise.all([
        apiFetch("/payment-methods/qr"),
        apiFetch("/payment-methods/bank")
      ]);
      if (qrRes.ok) setQrs(await qrRes.json());
      if (bankRes.ok) setBanks(await bankRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQRSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("label", qrForm.label);
    formData.append("upi_id", qrForm.upi_id);
    formData.append("is_active", String(qrForm.is_active));
    if (qrForm.image) formData.append("image", qrForm.image);

    try {
      const url = qrForm.id ? `/payment-methods/qr/${qrForm.id}` : "/payment-methods/qr";
      const res = await apiFetch(url, { method: qrForm.id ? "PUT" : "POST", body: formData });
      if (res.ok) {
        setShowQRModal(false);
        fetchData();
      }
    } catch (err) { alert("Failed to save QR code."); }
  };

  const handleBankSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = bankForm.id ? `/payment-methods/bank/${bankForm.id}` : "/payment-methods/bank";
      const res = await apiFetch(url, { 
        method: bankForm.id ? "PUT" : "POST", 
        body: JSON.stringify(bankForm)
      });
      if (res.ok) {
        setShowBankModal(false);
        fetchData();
      }
    } catch (err) { alert("Failed to save Bank Account."); }
  };

  const deleteQR = async (id: number) => {
    if (!window.confirm("Delete this QR Code?")) return;
    try {
      await apiFetch(`/payment-methods/qr/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) { alert("Failed to delete."); }
  };

  const deleteBank = async (id: number) => {
    if (!window.confirm("Delete this Bank Account?")) return;
    try {
      await apiFetch(`/payment-methods/bank/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) { alert("Failed to delete."); }
  };

  return (
    <div className="db-page" style={{ padding: "32px", background: "#fdfdfc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Hero Header */}
        <div style={{ 
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
            borderRadius: "20px", 
            padding: "40px", 
            marginBottom: "40px",
            color: "white",
            boxShadow: "0 10px 25px rgba(99, 102, 241, 0.15)",
            position: "relative",
            overflow: "hidden"
        }}>
          <div style={{ position: "absolute", right: "-30px", top: "-30px", fontSize: "180px", opacity: 0.1, transform: "rotate(-15deg)" }}>
            <FaQrcode />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-1px" }}>Payment Methods</h1>
            <p style={{ opacity: 0.8, fontSize: "1.1rem", maxWidth: "600px", marginTop: "8px" }}>Configure your shop's payment infrastructure. Manage UPI QR codes and official bank accounts for seamless settlements.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "100px", textAlign: "center" }}>
            <div className="spinner-innovative" style={{ margin: "0 auto" }}></div>
            <p style={{ marginTop: "16px", color: "#64748b", fontWeight: 600 }}>Loading Payment Methods...</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "32px" }}>
            
            {/* QR Codes Section */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid #f1f1f0", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "12px", color: "#1e293b" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FaQrcode color="#6366f1" size={18} />
                    </div>
                    QR Codes
                  </h2>
                </div>
                <button 
                  onClick={() => { setQrForm({ id: null, label: "", upi_id: "", is_active: true, image: null }); setShowQRModal(true); }} 
                  style={{ background: "#6366f1", color: "white", padding: "10px 20px", borderRadius: "12px", border: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)" }}
                >
                  <FaPlus size={12} /> Add New QR
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px" }}>
                {qrs.length === 0 ? (
                   <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #e2e8f0" }}>
                      <p style={{ color: "#94a3b8", fontSize: "14px" }}>No QR codes configured yet.</p>
                   </div>
                ) : qrs.map(qr => (
                  <div key={qr.id} style={{ 
                    border: "1px solid #f1f1f0", 
                    borderRadius: "16px", 
                    padding: "16px", 
                    background: qr.is_active ? "#fff" : "#f8fafc",
                    transition: "all 0.2s ease",
                    position: "relative"
                  }}>
                    <div style={{ width: "100%", height: "140px", background: "#f8fafc", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", overflow: "hidden" }}>
                      {qr.image_url ? (
                        <img src={qr.image_url} alt={qr.label} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <FaQrcode size={40} color="#cbd5e1" />
                      )}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1e293b", marginBottom: "2px" }}>{qr.label}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "12px", wordBreak: "break-all" }}>{qr.upi_id}</div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f1f0" }}>
                      <span style={{ 
                        padding: "4px 10px", 
                        borderRadius: "100px", 
                        background: qr.is_active ? "#ecfdf5" : "#fef2f2", 
                        color: qr.is_active ? "#10b981" : "#ef4444", 
                        fontSize: "11px", 
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        {qr.is_active ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                        {qr.is_active ? "Active" : "Inactive"}
                      </span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => { setQrForm({ ...qr, image: null }); setShowQRModal(true); }} style={{ padding: "6px", color: "#64748b", cursor: "pointer", borderRadius: "6px" }}><FaEdit size={14} /></button>
                        <button onClick={() => deleteQR(qr.id)} style={{ padding: "6px", color: "#ef4444", cursor: "pointer", borderRadius: "6px" }}><FaTrash size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Accounts Section */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid #f1f1f0", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "12px", color: "#1e293b" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FaUniversity color="#f59e0b" size={18} />
                    </div>
                    Bank Accounts
                  </h2>
                </div>
                <button 
                  onClick={() => { setBankForm({ id: null, bank_name: "", account_number: "", ifsc_code: "", holder_name: "", is_active: true }); setShowBankModal(true); }} 
                  style={{ background: "#f59e0b", color: "white", padding: "10px 20px", borderRadius: "12px", border: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)" }}
                >
                  <FaPlus size={12} /> Add Bank
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {banks.length === 0 ? (
                   <div style={{ padding: "40px", textAlign: "center", background: "#fdfdfc", borderRadius: "16px", border: "1px dashed #e2e8f0" }}>
                      <p style={{ color: "#94a3b8", fontSize: "14px" }}>No bank accounts added.</p>
                   </div>
                ) : banks.map(bank => (
                  <div key={bank.id} style={{ 
                    border: "1px solid #f1f1f0", 
                    borderRadius: "16px", 
                    padding: "20px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    background: bank.is_active ? "#fff" : "#f8fafc"
                  }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                       <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaUniversity color="#94a3b8" />
                       </div>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1e293b" }}>{bank.bank_name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>{bank.holder_name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: "monospace", marginTop: "4px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", display: "inline-block" }}>
                            {bank.account_number} • {bank.ifsc_code}
                          </div>
                       </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                      <span style={{ 
                        padding: "4px 10px", 
                        borderRadius: "100px", 
                        background: bank.is_active ? "#ecfdf5" : "#fef2f2", 
                        color: bank.is_active ? "#10b981" : "#ef4444", 
                        fontSize: "11px", 
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        {bank.is_active ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                        {bank.is_active ? "Active" : "Inactive"}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => { setBankForm(bank); setShowBankModal(true); }} style={{ padding: "8px", color: "#6366f1", cursor: "pointer", borderRadius: "8px", background: "#f5f3ff" }}><FaEdit size={14} /></button>
                        <button onClick={() => deleteBank(bank.id)} style={{ padding: "8px", color: "#ef4444", cursor: "pointer", borderRadius: "8px", background: "#fef2f2" }}><FaTrash size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="modal-overlay">
          <div style={{ background: "#fff", padding: "40px", borderRadius: "28px", width: "450px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
            <h2 style={{ margin: "0 0 8px 0", fontWeight: 800, color: "#1e293b" }}>{qrForm.id ? "Edit QR Code" : "Add QR Code"}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Provide UPI details and upload a QR image for display.</p>
            
            <form onSubmit={handleQRSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Label</label>
                <input required placeholder="e.g. GPay, Business QR" value={qrForm.label} onChange={e => setQrForm({ ...qrForm, label: e.target.value })} style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.05em" }}>UPI ID</label>
                <input required placeholder="yourname@bank" value={qrForm.upi_id} onChange={e => setQrForm({ ...qrForm, upi_id: e.target.value })} style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.05em" }}>QR Image</label>
                <input type="file" accept="image/*" onChange={e => setQrForm({ ...qrForm, image: e.target.files?.[0] || null })} style={{ padding: "8px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc" }} />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", userSelect: "none", fontSize: "14px", fontWeight: 600 }}>
                <input type="checkbox" checked={qrForm.is_active} onChange={e => setQrForm({ ...qrForm, is_active: e.target.checked })} style={{ width: "18px", height: "18px" }} /> Mark as Active
              </label>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowQRModal(false)} style={{ flex: 1, padding: "14px", borderRadius: "14px", background: "#f1f5f9", color: "#475569", fontWeight: 700, border: "none", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: "14px", background: "#6366f1", color: "white", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)" }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bank Modal */}
      {showBankModal && (
        <div className="modal-overlay">
          <div style={{ background: "#fff", padding: "40px", borderRadius: "28px", width: "450px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
            <h2 style={{ margin: "0 0 8px 0", fontWeight: 800, color: "#1e293b" }}>{bankForm.id ? "Edit Bank Account" : "Add Bank Account"}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Enter official bank details for payouts and transfers.</p>
            
            <form onSubmit={handleBankSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>Bank Name</label>
                    <input required placeholder="e.g. HDFC Bank" value={bankForm.bank_name} onChange={e => setBankForm({ ...bankForm, bank_name: e.target.value })} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>Holder Name</label>
                    <input required placeholder="Name as per bank records" value={bankForm.holder_name} onChange={e => setBankForm({ ...bankForm, holder_name: e.target.value })} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>Account Number</label>
                    <input required placeholder="Enter full account number" value={bankForm.account_number} onChange={e => setBankForm({ ...bankForm, account_number: e.target.value })} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>IFSC Code</label>
                    <input required placeholder="e.g. HDFC0001234" value={bankForm.ifsc_code} onChange={e => setBankForm({ ...bankForm, ifsc_code: e.target.value })} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                 </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600, marginTop: "8px" }}>
                <input type="checkbox" checked={bankForm.is_active} onChange={e => setBankForm({ ...bankForm, is_active: e.target.checked })} style={{ width: "18px", height: "18px" }} /> Active Account
              </label>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowBankModal(false)} style={{ flex: 1, padding: "14px", borderRadius: "14px", background: "#f1f5f9", color: "#475569", fontWeight: 700, border: "none", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: "14px", background: "#f59e0b", color: "white", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)" }}>Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsAdmin;
