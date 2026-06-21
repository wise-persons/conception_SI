export function StatCard({ icon, value, label }) {
    return (
        <div className="card stat-card">
            <div className="stat-icon">{icon}</div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>
        </div>
    );
}

export default StatCard;
