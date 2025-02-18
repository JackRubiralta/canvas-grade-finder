document.getElementById('calcGradeBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        document.getElementById('output').textContent = 'No active tab found.';
        return;
      }
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          world: 'MAIN', // Run in the page’s context so ENV and DOM are accessible
          func: runSnippetVerbatim
        },
        (injectionResults) => {
          if (!injectionResults || !injectionResults[0]) {
            document.getElementById('output').textContent =
              'No result (not a valid Canvas Grades page?)';
            return;
          }
          // The result is returned from runSnippetVerbatim()
          const result = injectionResults[0].result;
          document.getElementById('output').textContent = result || 'No grade data found.';
        }
      );
    });
  });
  
  /**
   * runSnippetVerbatim() first attempts to compute the weighted grade using Canvas's ENV data.
   * If no weighted data is found (e.g. because the course only uses pure points),
   * it falls back to scraping the DOM to compute a pure points grade.
   */
  function runSnippetVerbatim() {
    let output = "";
  
    // --- Try weighted grade calculation via ENV ---
    if (typeof ENV !== "undefined" && Array.isArray(ENV.assignment_groups) && ENV.assignment_groups.length > 0) {
      let totalWeighted = 0;
      let totalWeightUsed = 0;
  
      ENV.assignment_groups.forEach((group) => {
        const groupWeight = group.group_weight; // e.g. 10 for 10%
        const groupAssignments = group.assignments || [];
        let groupPointsEarned = 0;
        let groupPointsPossible = 0;
  
        groupAssignments.forEach((assignment) => {
          const assignmentId = parseInt(assignment.id, 10);
          // Find the matching submission
          const submission = (ENV.submissions || []).find(
            (sub) => parseInt(sub.assignment_id, 10) === assignmentId
          );
          if (!submission) return;
          if (submission.workflow_state !== "graded") return;
          const scoreEarned = parseFloat(submission.score);
          const pointsPossible = parseFloat(assignment.points_possible);
          if (!isNaN(scoreEarned) && !isNaN(pointsPossible) && pointsPossible > 0) {
            groupPointsEarned += scoreEarned;
            groupPointsPossible += pointsPossible;
          }
        });
  
        if (groupPointsPossible > 0) {
          const groupPercentage = (groupPointsEarned / groupPointsPossible) * 100;
          totalWeighted += groupPercentage * (groupWeight / 100);
          totalWeightUsed += groupWeight;
        }
      });
  
      if (totalWeightUsed > 0) {
        const currentWhatIfGrade = totalWeighted / totalWeightUsed * 100;
        output = `Current Weighted Grade: ${currentWhatIfGrade.toFixed(2)}%`;
      }
    }
  
    // --- If no weighted grade computed, fallback to pure points from DOM ---
    if (!output) {
      let totalEarned = 0;
      let totalPossible = 0;
      const assignments = document.querySelectorAll("td.assignment_score");
  
      assignments.forEach((assignment) => {
        const gradeElement = assignment.querySelector(".grade");
        if (gradeElement) {
          let pointsEarnedText = "";
          gradeElement.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
              pointsEarnedText = node.textContent.trim();
            }
          });
          const pointsEarned = parseFloat(pointsEarnedText);
          const pointsPossibleElement = gradeElement.nextElementSibling;
          if (pointsPossibleElement) {
            const pointsPossibleText = pointsPossibleElement.textContent.replace("/", "").trim();
            const pointsPossible = parseFloat(pointsPossibleText);
            if (!isNaN(pointsEarned) && !isNaN(pointsPossible)) {
              totalEarned += pointsEarned;
              totalPossible += pointsPossible;
            }
          }
        }
      });
  
      if (totalPossible > 0) {
        output =
          "Current Unweighted Grade: " + ((totalEarned / totalPossible) * 100).toFixed(2) + "%";
      }
    }
  
    return output || "No grade data found.";
  }
  