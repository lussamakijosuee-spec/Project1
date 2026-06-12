/*:
 * @plugindesc Système de Folie Psychologique et de Karma.
 * @author Ton Nom
 *
 * @param ActorId
 * @desc L'ID du personnage qui devient agressif (Celle qui subit).
 * @default 1
 *
 * @param LouId
 * @desc L'ID du personnage "Lou" (La cible de sa rancœur).
 * @default 2
 *
 * @param RageVariable
 * @desc L'ID de la variable RPG Maker qui stocke le niveau de Rage (0 à 100).
 * @default 10
 *
 * @param RageStateId
 * @desc L'ID de l'état "Folie Meurtrière" dans ta base de données.
 * @default 15
 * * @help
 * Ce plugin modifie le comportement en combat et les statistiques
 * en fonction de la santé mentale du personnage.
 */

(function() {
    var parameters = PluginManager.parameters('PsychoSystem');
    var ACTOR_ID = Number(parameters['ActorId'] || 1);
    var LOU_ID = Number(parameters['LouId'] || 2);
    var RAGE_VAR_ID = Number(parameters['RageVariable'] || 10);
    var STATE_ID = Number(parameters['RageStateId'] || 15);

    // 1. CIBLAGE PSYCHOLOGIQUE : Forcer l'attaque sur Lou lors de la confusion
    var alias_Game_Action_confusionTarget = Game_Action.prototype.confusionTarget;
    Game_Action.prototype.confusionTarget = function() {
        var subject = this.subject();
        
        // Si c'est notre personnage instable ET qu'elle a le statut Folie
        if (subject.isActor() && subject.actorId() === ACTOR_ID && subject.isStateAffected(STATE_ID)) {
            // Chercher Lou dans le groupe
            var lou = $gameParty.members().find(function(member) {
                return member.actorId() === LOU_ID && member.isAlive();
            });
            
            // Si Lou est là et vivant, elle le cible en priorité absolue !
            if (lou) {
                return lou; 
            }
        }
        // Sinon, comportement normal de confusion
        return alias_Game_Action_confusionTarget.call(this);
    };

    // 2. CORRUPTION DES STATISTIQUES : La rage donne de la force mais détruit la maîtrise
    var alias_Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        var value = alias_Game_Actor_paramPlus.call(this, paramId);
        
        if (this.actorId() === ACTOR_ID) {
            var rageLevel = $gameVariables.value(RAGE_VAR_ID); // Récupère la Jauge
            
            if (paramId === 2) { // ATK (Attaque)
                // Plus elle est enragée, plus elle frappe fort (+0.5 ATK par point de Rage)
                value += Math.floor(rageLevel * 0.5); 
            }
            if (paramId === 3) { // DEF (Défense / Maîtrise de soi)
                // Plus elle est enragée, plus elle est vulnérable (-0.3 DEF par point de Rage)
                value -= Math.floor(rageLevel * 0.3); 
            }
        }
        return value;
    };
})();