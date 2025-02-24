import React from "react";

const stages = ["Processing", "Processed", "Shipped", "Out for Delivery", "Delivered"];

const OrderProgress = ({ currentStatus }) => {
    const currentIndex = stages.indexOf(currentStatus);

    return (
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
            {stages.map((stage, index) => (
                <React.Fragment key={stage}>
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: index <= currentIndex ? "#4CAF50" : "#ccc",
                                margin: "auto",
                            }}
                        />
                        <span style={{ fontSize: "12px" }}>{stage}</span>
                    </div>
                    {index < stages.length - 1 && (
                        <div
                            style={{
                                height: "3px",
                                flex: 1,
                                backgroundColor: index < currentIndex ? "#4CAF50" : "#ccc",
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default OrderProgress;
