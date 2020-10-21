import { Input, LogicComponent, Output } from "./component";
import { Bus } from "./connections";

export class AndGate extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 0, 0);
  public in1 = new Input('in1', 0, 0);
  public out = new Output('out', 0, 0);

  constructor()
  {
    super("AndGate");
  }

  public eval()
  {
    const a = this.in0.asBoolean, b = this.in1.asBoolean;
    if (a === undefined || b === undefined)
    {
      this.out.clear();
    }
    else
    {
      this.out.asBoolean = a && b;
    }
  }
}
