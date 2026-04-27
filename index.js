let invoices = JSON.parse(localStorage.getItem('mansuriExactCode')) || [];

function login(){
    if(document.getElementById("username").value==='tosif' && document.getElementById("password").value==='123123'){
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("mainPage").classList.remove("hidden");
        render();
    } else {
        alert("Wrong Login");
    }
}

function addItem(){
    let row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
    <input placeholder="ITEM NAME">
    <input type="number" placeholder="QTY" oninput="calculateTotals()">
    <input type="number" placeholder="RATE" oninput="calculateTotals()">`;
    document.getElementById("items").appendChild(row);
}
addItem();

function getPreviousBalance(name){
    return invoices.filter(x=>x.party===name).reduce((a,b)=>a+Number(b.currentBalance),0);
}

function calculateTotals(){
    let total = 0;
    document.querySelectorAll('.item-row').forEach(r=>{
        total += (Number(r.children[1].value)||0) * (Number(r.children[2].value)||0);
    });

    let prev = getPreviousBalance(document.getElementById("party").value);
    let rec = Number(document.getElementById("received").value)||0;

    document.getElementById("totalAmount").innerText = total;
    document.getElementById("previousBalance").innerText = prev;
    document.getElementById("currentBalance").innerText = total + prev - rec;
}

function saveInvoice(){
    let itemData = [];
    document.querySelectorAll('.item-row').forEach(r=>{
        itemData.push({
            name:r.children[0].value,
            qty:r.children[1].value,
            rate:r.children[2].value,
            amount:(Number(r.children[1].value)||0)*(Number(r.children[2].value)||0)
        });
    });

    let invoice = {
        no: invoices.length+1,
        date: new Date().toLocaleDateString(),
        party: document.getElementById("party").value,
        mobile: document.getElementById("partyMobile").value,
        items: itemData,
        total: document.getElementById("totalAmount").innerText,
        received: document.getElementById("received").value,
        previousBalance: document.getElementById("previousBalance").innerText,
        currentBalance: document.getElementById("currentBalance").innerText
    };

    invoices.unshift(invoice);
    localStorage.setItem('mansuriExactCode', JSON.stringify(invoices));

    document.getElementById("party").value='';
    document.getElementById("partyMobile").value='';
    document.getElementById("received").value='';
    document.getElementById("items").innerHTML='';
    addItem();

    render();
    alert("Invoice Saved");
}

function printInvoice(i){
    let inv = invoices[i];
    let rows = inv.items.map(x=>`<tr><td>${x.name}</td><td>${x.qty}</td><td>${x.rate}</td><td>${x.amount}</td></tr>`).join('');

    let w = window.open('');
    w.document.write(`
    <h2 style='text-align:center'>MANSURI ELECTRICALS WORK'S</h2>
    <p style='text-align:center'>5, BNP Rd, Adarsh Nagar, bhosale colony, Dewas, Madhya Pradesh, 455001<br>
    Mobile: 8982216593<br>Email: Tosifmansuri009@gmail.com</p>

    <div style='display:flex;justify-content:space-between'>
    <span>Invoice No.: ${inv.no}</span>
    <span>Invoice Date: ${inv.date}</span>
    </div>

    <h3>BILL TO</h3>
    <p>${inv.party}</p>

    <table border='1' width='100%' cellspacing='0' cellpadding='5'>
    <tr><th>ITEMS</th><th>QTY.</th><th>RATE</th><th>AMOUNT</th></tr>
    ${rows}
    </table>

    <p>SUBTOTAL ${inv.items.length} ₹ ${inv.total}</p>

    <h4>BANK DETAILS</h4>
    <p>Name: MANSURI ELECTRICALS WORK'S<br>
    IFSC Code: IDIB000D043<br>
    Account No: 8108248750<br>
    Bank: Indian Bank, DEWAS</p>

    <p>Total Amount ₹ ${inv.total}</p>
    <p>Received Amount ₹ ${inv.received}</p>
    <p>Previous Balance ₹ ${inv.previousBalance}</p>
    <p>Current Balance ₹ ${inv.currentBalance}</p>
    <p>Total Amount (in words)<br>${inv.total} Rupees</p>

    <p style='text-align:right'>AUTHORISED SIGNATORY FOR<br>MANSURI ELECTRICALS WORK'S</p>
    <p style='text-align:center'>BILL OF SUPPLY ORIGINAL FOR RECIPIENT</p>
    `);
    w.print();
}

function render(){
    document.getElementById("invoiceNo").innerText = invoices.length+1;
    document.getElementById("invoiceDate").innerText = new Date().toLocaleDateString();
    document.getElementById("history").innerHTML = '';

    invoices.forEach((inv,i)=>{
        document.getElementById("history").innerHTML += `
        <div class='bill-card'>
            <p><b>Invoice #${inv.no}</b> - ${inv.party}</p>
            <button onclick='printInvoice(${i})'>Open PDF Bill</button>
        </div>`;
    });
}
