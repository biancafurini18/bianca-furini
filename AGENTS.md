<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the application frontend-only for Databricks, with disabled relative FastAPI integration points until implemented, because the external API owns all production data and identity.
- Keep activity demo fixtures in a dedicated JSON dataset and rule/queue logic in a browser-safe module, because fictitious session state must remain isolated from production authorization and persistence.
- Use canonical IDs for the activity hierarchy and immutable versioned mutation/audit snapshots, because normalized duplicates and stale edits must be rejected without silent overwrites.
- Store activity periods as date-only ISO startDate/endDate fields and derive the embedded read-only Gantt from the same scoped, filtered entries as each table; use date-fns for calendar geometry to avoid timezone drift and unrelated visibility rules.
- Aggregate Gantt rows by canonical macrotheme ID in the browser-safe timeline module and expose scoped entry children on expansion, because summary bars and activity details must share the table's visibility rules.
