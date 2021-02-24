DESIGN
======


Server-side:
------------
<== Stateless, central place for service-execution & result caching
    Database of abstract scenarios
    Database of abstract processes
    Database of abstract products
    Concrete instances of processes 
        (out of pre-approved list with in-source concrete implementations) 
        (only server knows if a given Product is a WpsProduct or if a given Process is a WpsProcess)
    Execution of processes
    Product cache

Frontend:   
---------
<== Stateful, cannot execute processes
    Abstract processes
    Concrete current products
    Concrete current scenario-state <== The backend cannot maintain a current scenario-state for every currently connected user.
