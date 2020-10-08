// src/utils/DPConnect.js - A connection between a gate and a wire

class DPConnect
{
  constructor(processor, wire, gate, pinName)
  {
    this.processor = processor;
    this.wire = wire;
    this.pinName = pinName;
    this.gate = gate;

    // The location of the connection in the SVG.  This is set by
    // the gate when the connection is made.
    this.x = 0;
    this.y = 0;
    if (this.gate)
    {
      this.gate.connectToPin(this, pinName);
    }

    // During simulation:
    // Is this connector (if it is an input to the wire) currently
    // being driven?
    this.active = false;
    // Is this connector (if it is an output of the wire) currently
    // being used?
    this.used = false;
    // What value is being driven from this connector to the wire?
    this.value = 0;
  }

  // When connecting to the gate, the gate gives the location of the
  // connector.
  set_location(x, y)
  {
    this.x = x;
    this.y = y;
  }

  // Set the value of the wire to be the given value.  This actually
  // just sets the value of the connector, then lets the wire do the
  // evaluation.  This way the wire can look for conflicts.
  set_value(value)
  {
    this.active = true;
    this.value = value;
    this.wire.eval();
  }

  // This is called when a gate (such as a tristate) determines that the
  // connector is NOT really being driven.
  clear_value()
  {
    this.active = false;
    this.value = 'Unknown';
    this.wire.eval();
  }
  
  // Return the value of this connector (and hence, the wire)
  get_value()
  {
    return this.wire.get_value();
  }

  // Return the value of this connector, and mark it as being used
  use_value()
  {
    this.used = true;
    return this.wire.get_value();
  }

  is_used()
  {
    return this.used;
  }
};

export default DPConnect;
