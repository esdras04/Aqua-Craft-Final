function showCompletionMessage() {
    const completionDiv = document.createElement('div');
    completionDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        z-index: 2000;
        text-align: center;
        border: 3px solid #6b9f78;
        max-width: 500px;
    `;
    
    completionDiv.innerHTML = `
        <h2 style="color: #2c5f6f; margin-bottom: 15px; font-size: 2rem;">🎉 Water Purified!</h2>
        <p style="color: #5a8a9a; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
            Excellent work, chemist! You've successfully purified the water sample. 
            In real-world situations, access to clean water saves lives every day.
        </p>
        <button onclick="location.reload()" style="
            padding: 15px 30px;
            background: linear-gradient(135deg, #2c8ba0 0%, #1a5f7a 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">Try Another Sample</button>
    `;
    document.body.appendChild(completionDiv);
    overlay.classList.add('active');
}
function showLoseMessage() {
    const loseDiv = document.createElement('div');
    loseDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        z-index: 2000;
        text-align: center;
        border: 3px solid #6b9f78;
        max-width: 500px;
    `;
    
    loseDiv.innerHTML = `
        <h2 style="color: #2c5f6f; margin-bottom: 15px; font-size: 2rem;">❌ Water NOT Purified!</h2>
        <p style="color: #5a8a9a; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
            Water has high level of contaminants left, chemist! Try Again to purify the water sample.
        <button onclick="location.reload()" style="
            padding: 15px 30px;
            background: linear-gradient(135deg, #2c8ba0 0%, #1a5f7a 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">Try Again</button>
    `;
    
    document.body.appendChild(loseDiv);
    overlay.classList.add('active');
}
