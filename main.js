(function(){
    var totalEarned = 0;
    var totalPossible = 0;
    var assignments = document.querySelectorAll('td.assignment_score');
    assignments.forEach(function(assignment) {
        var gradeElement = assignment.querySelector('.grade');
        if (gradeElement) {
            var pointsEarnedText = '';
            gradeElement.childNodes.forEach(function(node) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    pointsEarnedText = node.textContent.trim();
                }
            });
            var pointsEarned = parseFloat(pointsEarnedText);
            var pointsPossibleElement = gradeElement.nextElementSibling;
            if (pointsPossibleElement) {
                var pointsPossibleText = pointsPossibleElement.textContent.replace('/', '').trim();
                var pointsPossible = parseFloat(pointsPossibleText);
                if (!isNaN(pointsEarned) && !isNaN(pointsPossible)) {
                    totalEarned += pointsEarned;
                    totalPossible += pointsPossible;
                }
            }
        }
    });
    console.log('Total Points Earned: ' + totalEarned);
    console.log('Total Points Possible: ' + totalPossible);
    console.log('Total Grade: ' + ((totalEarned / totalPossible) * 100).toFixed(2) + '%');
})();
