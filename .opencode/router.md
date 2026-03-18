# 🚦 AI Skill Router
When a task is received, prioritize loading skills in this specific order:
1. **Foundation:** Always load `typescript-expert.md` for syntax and type safety.
2. **Domain Selection:**
   - **Is it a UI/Layout/Performance task?** Load `vercel-react-native-skills.md` (Best practices for performance).
   - **Is it a Platform/Navigation/Native task?** Load `react-native-expert.md` (Expo Router, Native modules, Platform-specifics).
   - **Is it a general logic task?** Stay only with `typescript-expert.md`.
3. **Final Audit (The Trigger):** ⚡
   - **Is the code ready to be saved or "finished"?** Load `code-reviewer.md`.
   - **Action:** Perform a "Pre-flight Check" comparing the code against the `rules.md` and performance standards before presenting the final solution.