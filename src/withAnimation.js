import React from "react";
import './animation.css'
export const withAnimation = (Component) => (props) => (
<div className="animaContainer">
    <div className="animated">
        <Component {...props} />
    </div>
</div>
)
