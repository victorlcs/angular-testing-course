import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", ()=>{
    //Method 1
    it("Asynchronous test example with Jasmine done()", (done:DoneFn)=>{
        let test = false;

        setTimeout(()=>{
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done();
        },1000);
    });

    //Method 2 Alternative way/ Better way
    it("Asynchronous test example - setTimeout()", fakeAsync(()=>{
        let test = false;

        setTimeout(()=>{
            console.log('running assertions setTimeout()');
            test = true;
        },1000);

        tick(1000) // can only be called inside fakeAsync //moving a clock forward, so the setTimeout get executed
        expect(test).toBeTruthy(); //espect can be write outside the async setTimeout code block. (benefits of this method)
    }));

    //Method 3 //instead of tick, we can use flush
    it("Asynchronous test example - setTimeout()", fakeAsync(()=>{
        let test = false;

        setTimeout(()=>{});
        setTimeout(()=>{
            console.log('running assertions setTimeout()');
            test = true;
        },1000);

        flush(); //Will execute all the setTimeout function (benefits: no need specific the milliseconds)
        
        expect(test).toBeTruthy(); //espect can be write outside the async setTimeout code block. (benefits of this method)
    }));

    //Method 4 //Testing promises
    it("Asynchronous test example - plain Promise", fakeAsync(()=>{
        let test = false;
        console.log('Creating promise');
        
        Promise.resolve().then(()=> {
            console.log('Promise evaluated successfully');
            test= true;
        })

        flushMicrotasks(); //Because promises is in a Microtask queue : setTimeout is a Macrotask queue
        console.log('Running test assertions');
        
        expect(test).toBeTruthy(); //espect can be write outside the async setTimeout code block. (benefits of this method)
    }));

    //Method 5 //Testing MicroTask together with MacroTask
    it("Asynchronous test example - Promises + setTimeout()", fakeAsync(()=>{
        let counter = 0;
        
        Promise.resolve().then(()=> {
            counter += 10;
            setTimeout(() => {
                counter ++;
            }, 1000);
        })
        
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10); //true because Promise will be executed
        tick(500);
        expect(counter).toBe(10); //true because setTimeout havent trigger
        tick(500);
        expect(counter).toBe(11);
    }));

    //Example 6 //Testing Observable
    it("Asynchronous test example - Observables", ()=>{
        let test = false;
        console.log('Creating Observables');
        const test$ = of(test);
        test$.subscribe(()=>{
            test = true;
        });
        console.log('Running test assertions');
        expect(test).toBe(true); //Will be success and no fakeAsync function is needed because observable subscribe happens synchronously
    });

    //Example 7 //Testing Observable with delay
    fit("Asynchronous test example - Observables", fakeAsync(()=>{
        let test = false;
        console.log('Creating Observables');
        const test$ = of(test).pipe(delay(1000));
        test$.subscribe(()=>{
            test = true;
        });
        tick(1000);
        console.log('Running test assertions');
        expect(test).toBe(true);
    }));
})