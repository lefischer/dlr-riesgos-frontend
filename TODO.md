TODOS
=====

 - frontend
   - vei3 -> lahar_arrival: slider
     - create custom-ol-layer olGroupLayer
       - is this really necessary? why does map-ol not render an olGroup in a custom layer?
     - create controller to slide between members of the group
     - bug: somehow, layers end up in capas-adicionales
   - get all chains from middleware
     - add styling on the fly
 - middleware
   - store metadata in db
   - arrange processes in chains
     - required custom processes:
       - renamer
   - store chains in db