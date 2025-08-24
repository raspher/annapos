import React from "react";
import "./Loading.css"; // styles separate for clarity

export default function Loading({ message = "Loading..." }) {
    return (
        <div className="loading-container">
            <div className="spinner" />
            <p>{message}</p>
        </div>
    );
}
