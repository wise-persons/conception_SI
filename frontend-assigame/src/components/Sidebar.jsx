import { NavLink } from "react-router-dom";

export default function Sidebar({ title, items }) {
    return (
        <aside className="sidebar-root">
            <div className="sidebar-title">{title}</div>
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
                >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </aside>
    );
}
