import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="gradient-sidebar absolute left-0 top-0">
      {/* Top Logo / Icon */}
      <div className="sidebar-logo">✳</div>
      
      {/* Bottom Text Content */}
      <div className="sidebar-content">
        <span className="subtitle">You can easily</span>
        <h1 className="title">
          Get access your personal hub for clarity and productivity
        </h1>
      </div>
    </div>
  );
}