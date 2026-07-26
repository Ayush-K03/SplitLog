import { useLoaderData } from "react-router"
import { useState } from "react"
import axios from 'axios'
axios.defaults.withCredentials = true;

const SETTLEMENTS_PER_PAGE = 10;

export function ShowPastSettlements(){
    const {mySettlements} = useLoaderData();
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(mySettlements.length / SETTLEMENTS_PER_PAGE);
    const start = (page - 1) * SETTLEMENTS_PER_PAGE;
    const visible = mySettlements.slice(start, start + SETTLEMENTS_PER_PAGE);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Past Settlements</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                        All payments you've made or received
                    </p>
                </div>
                <span className="group-count-badge">
                    {mySettlements.length} settlement{mySettlements.length !== 1 ? 's' : ''}
                </span>
            </div>

            {mySettlements.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">💳</div>
                        <h3 className="empty-state-title">No settlements yet</h3>
                        <p className="empty-state-description">
                            Payments you've made or received will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="list-container">
                        {visible.map((value, idx) => (
                            <div key={idx} className="list-item settlement-history-item">
                                <div className="settlement-history-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 7h11l-3-3M20 17H9l3 3"/>
                                    </svg>
                                </div>
                                <div className="list-item-content">
                                    <div className="list-item-title">
                                        Paid to {value.to?.firstName || "Unknown User"}
                                    </div>
                                    <div className="list-item-subtitle">
                                        {new Date(value.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                </div>
                                <div className="settlement-history-amount">
                                    ₹{(value.amount / 100).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-bar">
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                aria-label="Previous page"
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    className={`pagination-btn${p === page ? ' active' : ''}`}
                                    onClick={() => setPage(p)}
                                    aria-label={`Page ${p}`}
                                    aria-current={p === page ? 'page' : undefined}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                aria-label="Next page"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
