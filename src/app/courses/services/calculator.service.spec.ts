import { TestBed } from "@angular/core/testing";
import { add } from "cypress/types/lodash";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

xdescribe('CalculatorService',()=>{
    let calculator: CalculatorService, loggerSpy:any;

    //will run before each block (it())
    beforeEach(()=>{
        loggerSpy = jasmine.createSpyObj('LoggerService',["log"]); //1 //instead of create a new instance of LoggerSerice, we create a MOCK object
        TestBed.configureTestingModule({
            providers:[
                CalculatorService,
                {provide: LoggerService, useValue:loggerSpy}
            ]
        });
        calculator = TestBed.inject(CalculatorService);
    });
    it('Should add two numbers',()=>{
        const result = calculator.add(2,2);
        expect(result).toBe(4);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1); //Usually for service that was provided in root (One instance is expected)
    }); //to describe each specification
    it('Should substract two numbers',()=>{
        const result = calculator.subtract(2,2);
        expect(result).toBe(0, "Unexpected result!");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1); 
    }); //to describe each specification
})