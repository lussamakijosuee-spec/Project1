/*:
 * @target MV
 * @plugindesc Système de Screamer et Fichier pour la défaite contre Jade.
 * @author Partenaire de code
 * 
 * @help
 * Ce plugin contourne la limite de texte de la boîte de script des évènements.
 * Pour déclencher le crash, utilisez cette ligne dans la commande Script :
 * 
 * JadeScreamer.executerCrash();
 * 
 */

var JadeScreamer = JadeScreamer || {};

JadeScreamer.executerCrash = function() {
    // Vérification de l'environnement PC/Mac (NW.js)
    if (Utils.isNwjs()) {
        var fs = require('fs');
        var path = require('path');
        var os = require('os');
        var win = nw.Window.get();
        
        // 1. AUDIO : Forcer le volume au maximum
        AudioManager.masterVolume = 100;
        AudioManager.seVolume = 100;
        AudioManager.playSe({ name: 'Scream', volume: 100, pitch: 50, pan: 0 });
        
        // 2. FENÊTRE : Paramètres du tremblement
        var shakeCount = 0;
        var originalX = win.x;
        var originalY = win.y;
        var intensity = 40; 
        
        var shakeInterval = setInterval(function() {
            var offsetX = (Math.random() - 0.5) * intensity * 2;
            var offsetY = (Math.random() - 0.5) * intensity * 2;
            win.moveTo(originalX + offsetX, originalY + offsetY);
            shakeCount++;
            
            // 3. EXÉCUTION : Fichier sur le bureau et crash
            if (shakeCount > 60) {
                clearInterval(shakeInterval);
                win.moveTo(originalX, originalY);
                
                // Création du fichier "A_JAMAIS.txt"
                var desktopPath = path.join(os.homedir(), 'Desktop');
                var fileName = path.join(desktopPath, 'A_JAMAIS.txt');
                var playerName = os.userInfo().username;
                
                var message = "Tu as perdu, " + playerName + ".\n\n";
                message += "Ton âme m'appartient maintenant.\n";
                message += "Inutile de relancer le jeu.\n\n";
                message += "- Jade";
                
                try {
                    fs.writeFileSync(fileName, message, 'utf8');
                } catch (e) {
                    console.error("Erreur de création du fichier :", e);
                }
                
                // Fermeture violente
                win.close(true);
            }
        }, 30);
        
    } else {
        // Sécurité si joué sur Navigateur Web
        SceneManager.goto(Scene_Gameover);
    }
};