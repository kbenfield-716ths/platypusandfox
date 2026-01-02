import"./hoisted.BC4Az56t.js";const o="bycampfireandcandlelight",a=`https://${o}.substack.com/feed`;async function i(){const n=document.getElementById("substack-feed");try{const e=await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(a)}`)).json();if(e.status==="ok"&&e.items&&e.items.length>0){const s=e.items.slice(0,5);n.innerHTML=s.map(t=>`
          <div class="project-card" style="margin-bottom: 2rem;">
            <div class="project-content">
              <h3>${t.title}</h3>
              <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.75rem;">
                ${new Date(t.pubDate).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
              </p>
              <p>${t.description.replace(/<[^>]*>/g,"").substring(0,200)}...</p>
              <div class="project-links" style="margin-top: 1rem;">
                <a href="${t.link}" target="_blank" rel="noopener noreferrer">Read Full Post →</a>
              </div>
            </div>
          </div>
        `).join("")}else throw new Error("No posts found")}catch(r){console.error("Error loading Substack feed:",r),n.innerHTML=`
        <div class="card" style="text-align: center;">
          <p>Unable to load recent posts. Please visit 
            <a href="https://${o}.substack.com" target="_blank" rel="noopener noreferrer">
              my Substack
            </a> 
            to read my latest writing.
          </p>
        </div>
      `}}typeof window<"u"&&i();
