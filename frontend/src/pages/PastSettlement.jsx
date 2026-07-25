import { useNavigate,useLoaderData } from "react-router"
import {useState,useEffect} from "react"
import axios from 'axios'
axios.defaults.withCredentials = true;

export function ShowPastSettlements(){
    const {mySettlements} = useLoaderData();
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
                        {mySettlements.map((value, idx) => (
                            <div key={idx} className="list-item settlement-history-item">
                                <div className="settlement-history-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 7h11l-3-3M20 17H9l3 3"/>
                                    </svg>
                                </div>
                                <div className="list-item-content">
                                    <div className="list-item-title">
                                        Paid to {value.to.firstName}
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
                </div>
            )}
        </div>
    );
}
