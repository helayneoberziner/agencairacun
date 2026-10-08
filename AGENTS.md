# Architecture rules

* Use dnd kit sortable handles for case ordering and persist the shared display_order so public case lists follow the same sequence.
* Render admin editing pages directly inside EmbeddedAdminContext in the site editor, never in a nested admin iframe, to avoid document requests and duplicate navigation.
* Read social preview metadata from the same origin rendered public page so the preview reflects actual page metadata rather than separately maintained defaults.
* Include active cases explicitly placed in Produtora in PortfolioGrid and invalidate that query on case changes so case placement and ordering remain synchronized.