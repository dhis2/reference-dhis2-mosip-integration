export const popupHtml = `
<html>
<head>
    <title>PHN Lookup</title>
    <meta charset="utf-8" />
    <style>
        body { font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; padding: 20px; background: #f9fafb; color: #333; }
        label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #1c1c1c; }
        input { width: 100%; padding: 10px 12px; border: 1px solid #d5d8dc; border-radius: 3px; font-size: 14px; margin-bottom: 12px; box-sizing: border-box; }
        input:focus { outline: none; border-color: #0074e0; box-shadow: 0 0 0 2px rgba(0,116,224,0.2); }
        button { background: #0074e0; color: #fff; border: none; padding: 8px 16px; font-size: 14px; border-radius: 3px; cursor: pointer; }
        button:hover { background: #005bb5; }
        .profile { border: 1px solid #e0e0e0; padding: 12px; margin-top: 12px; border-radius: 4px; background: #fff; display: flex; justify-content: space-between; align-items: center; }
        .details { flex: 1; font-size: 13px; }
        .select-btn { margin-left: 12px; background: #0074e0; color: white; border: none; border-radius: 3px; padding: 6px 10px; cursor: pointer; }
        .select-btn:hover { background: #005bb5; }
        .not-found { color: #d0021b; background: #fdecea; border: 1px solid #f5c2c7; padding: 8px; border-radius: 3px; margin-top: 12px; font-size: 13px; }
        .loading { color: #555; background: #f5f5f5; border: 1px solid #ddd; padding: 8px; border-radius: 3px; margin-top: 12px; font-size: 13px; }
    </style>
</head>
<body>
    <label>Enter Existing PHN:</label>
    <input id="phnInput" type="text" placeholder="PHN here" />
    <button id="searchBtn">Search</button>
    <div id="result"></div>

    <script>
        (function () {
            const input = document.getElementById('phnInput');
            const resultEl = document.getElementById('result');
            const searchBtn = document.getElementById('searchBtn');

            function escapeHtml(s) {
                if (s == null) return 'N/A';
                return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            }

            function calculateAge(dob) {
                if (!dob) return "N/A";
                const birthDate = new Date(dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }

            // render results using DOM methods to avoid inline onclick injection
            function renderResults(entries, autoSelectIfSingle) {
                resultEl.innerHTML = '';
                if (!entries || entries.length === 0) {
                    resultEl.innerHTML = "<div class='not-found'>❌ No patient found</div>";
                    return;
                }

                // if (autoSelectIfSingle && entries.length === 1) {
                //     // auto-select single result
                //     const p = entries[0].resource;
                //     const phn = p.identifier?.find(i => i.system?.includes("phn"))?.value || input.value.trim();
                //     const nameObj = p.name?.[0] || {};
                //     const name = p.name?.[0]?.text || [nameObj.given?.join(" "), nameObj.family].filter(Boolean).join(" ") || "N/A";
                //     const firstName = nameObj.given?.[0] || "N/A";
                //     const lastName = nameObj.family || "N/A";
                //     const gender = p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "N/A";
                //     const age = calculateAge(p.birthDate);
                //     const phone = (p.telecom || []).filter(t => t.system === "phone").map(t => t.value).join(", ") || "N/A";
                //     const addr = p.address?.[0] ? [p.address[0].line?.[0], p.address[0].city].filter(Boolean).join(", ") : "N/A";

                //     // send selection to opener
                //     try {
                //         window.opener?.postMessage({
                //             type: "PHN_SELECTED",
                //             phn, dob: p.birthDate || "", firstName, lastName, name, address: addr, phone, gender, age
                //         }, "*");
                //     } catch (e) {}
                //     // then close
                //     // try { //window.close() } //catch (e) {}
                //     return;
                // }

                entries.forEach(e => {
                    const p = e.resource;
                    const phn = p.identifier?.find(i => i.system?.includes("phn"))?.value || input.value.trim();
                    const nameObj = p.name?.[0] || {};
                    const name = p.name?.[0]?.text || [nameObj.given?.join(" "), nameObj.family].filter(Boolean).join(" ") || "N/A";
                    const firstName = nameObj.given?.[0] || "N/A";
                    const lastName = nameObj.family || "N/A";
                    const gender = p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "N/A";
                    const age = calculateAge(p.birthDate);
                    const phone = (p.telecom || []).filter(t => t.system === "phone").map(t => t.value).join(", ") || "N/A";
                    const addr = p.address?.[0] ? [p.address[0].line?.[0], p.address[0].city].filter(Boolean).join(", ") : "N/A";

                    const profile = document.createElement('div');
                    profile.className = 'profile';

                    const details = document.createElement('div');
                    details.className = 'details';
                    details.innerHTML = '<b>Name:</b> ' + escapeHtml(name) + '<br/>' +
                                        '<b>Gender:</b> ' + escapeHtml(gender) + '<br/>' +
                                        '<b>Age:</b> ' + escapeHtml(age) + '<br/>' +
                                        '<b>Phone:</b> ' + escapeHtml(phone) + '<br/>' +
                                        '<b>Address:</b> ' + escapeHtml(addr);

                    const selectBtn = document.createElement('button');
                    selectBtn.className = 'select-btn';
                    selectBtn.textContent = 'Select';
                    selectBtn.addEventListener('click', () => {
                        try {
                            window.opener?.postMessage({
                                type: "PHN_SELECTED",
                                phn, dob: p.birthDate || "", firstName, lastName, name, address: addr, phone, gender, age
                            }, "*");
                        } catch (err) {}
                        try { window.close() } catch (err) {}
                    });

                    profile.appendChild(details);
                    profile.appendChild(selectBtn);
                    resultEl.appendChild(profile);
                });
            }

            // perform fetch search
            async function performSearch(value, autoSelectIfSingle = false) {
                const v = String(value || '').trim();
                if (!v) {
                    resultEl.innerHTML = "<div class='not-found'>⚠️ Please enter a PHN.</div>";
                    return;
                }
                resultEl.innerHTML = "<div class='loading'>⏳ Searching...</div>";

                try {
                    const response = await fetch(
                        "https://mosip.integration.dhis2.org/api/routes/queryNehr/run?identifier=" + encodeURIComponent(v),
                        {
                            method: "GET"
                        }
                    );

                    if (!response.ok) throw new Error("Server returned " + response.status);
                    const data = await response.json();

                    if (!data.entry || data.entry.length === 0) {
                        resultEl.innerHTML = "<div class='not-found'>❌ No patient found</div>";
                        return;
                    }

                    renderResults(data.entry, autoSelectIfSingle);

                } catch (err) {
                    resultEl.innerHTML = "<div class='not-found'>❌ Error: " + (err && err.message ? escapeHtml(err.message) : 'Unknown') + "</div>";
                }
            }

            // triggered by parent or user
            function triggerSearchFromParent(phn) {
                input.value = phn || '';
                // mark autoSelect true when triggered by parent
                performSearch(phn, true);
            }

            // listen for messages from opener
            window.addEventListener('message', (event) => {
                const d = event.data || {};
                if (!d || !d.type) return;
                if (d.type === 'INIT_PHN') {
                    // reply ack
                    try { window.opener?.postMessage({ type: 'INIT_ACK' }, "*") } catch (e) {}
                    if (d.phn) triggerSearchFromParent(d.phn);
                }
            });

            // announce ready to parent (after we registered listeners)
            try { window.opener?.postMessage({ type: 'POPUP_READY' }, "*") } catch (e) {}

            // manual search button
            searchBtn.addEventListener('click', () => performSearch(input.value, false));

            // focus input
            input.focus();
        })();
    </script>
</body>
</html>
`
