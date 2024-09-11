import React from "react";

const PurchaseRequestForm = () => {
  const purchaseItems = [
    { stockProperty: 'Laptop', unit: 'pcs', itemDescription: 'MacBook Pro 13"', quantity: 2, unitCost: 1200, totalCost: 2400 },
    { stockProperty: 'Monitor', unit: 'pcs', itemDescription: 'Dell 24-inch', quantity: 5, unitCost: 200, totalCost: 1000 },
  ];
  return (
    <div className="grid grid-cols-11 gap border">
      <div className="col-start-1 col-span-2 border"> Office/Section</div>
      <div className="col-start-3 col-span-6 border">
        <div className="">PR No.:</div>
        <div className=""> Responsibility Center Code: </div>
      </div>
      <div className="col-start-9 col-span-3 border">
        Date:
      </div>
      <div className="row-start-2 col-start-1 col-span-1 border">
        {" "}
        Stock / Property
      </div>
      <div className="row-start-2 col-start-2 col-span-1 border text-center">
        Unit
      </div>
      <div className="row-start-2 col-start-3 col-span-5 border text-center">
        {" "}
        Item Description
      </div>
      <div className="row-start-2 col-start-8 col-span-1 border text-center">
        Quantity
      </div>
      <div className="row-start-2 col-start-9 border text-center">
        Unit Cost
      </div>
      <div className="ro-start-2 col-start-10 col-span-2 border text-center">
        Total Cost
      </div>

      {purchaseItems.map((item, index) => (
        <React.Fragment key={index}>
          <div
            className={`row-start-${index + 3} col-start-1 col-span-1 border`}
          >
            {item.stockProperty}
          </div>
          <div
            className={`row-start-${
              index + 3
            } col-start-2 col-span-1 border text-center`}
          >
            {item.unit}
          </div>
          <div
            className={`row-start-${
              index + 3
            } col-start-3 col-span-5 border text-center`}
          >
            {item.itemDescription}
          </div>
          <div
            className={`row-start-${
              index + 3
            } col-start-8 col-span-1 border text-center`}
          >
            {item.quantity}
          </div>
          <div
            className={`row-start-${index + 3} col-start-9 border text-center`}
          >
            {item.unitCost}
          </div>
          <div
            className={`row-start-${
              index + 3
            } col-start-10 col-span-2 border text-center`}
          >
            {item.totalCost}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PurchaseRequestForm;
