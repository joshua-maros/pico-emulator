// src/utils/PDP8e.js - JSON structure for building the PDP8e Datapath

import { DatapathDef } from "../logic/datapath";

const x0 = 0;
const y0 = 0;
const x1 = x0 + 20;
const y1 = y0 + 100;
const x2 = x0 + 460;
const y2 = y0 + 80;
const x3 = x0 + 40;
const y3 = y0 + 260;

export const PICO: DatapathDef = {
  width: 770,
  height: 550,
  components: [
    {
      type: 'Mux',
      id: 'MIncSel',
      x: x1 + 10,
      y: y1 - 25
    },
    {
      type: 'Control',
      id: 'IncSel',
      name: 'incsel',
      x: x1 - 5,
      y: y1 + 35,
      wid: 50,
      top: true,
    },
    {
      type: 'Incrementer',
      id: 'Plus1',
      x: x1 + 70,
      y: y1 - 15,
      nbits: 7,
      constant: 1
    },
    {
      type: 'Expand',
      id: 'ExPC',
      x: x1 + 80,
      y: y1 + 25,
      inNBits: 12,
      outNBits: 7,
      extend: false
    },
    {
      type: 'Mux',
      id: 'MPC',
      x: x1 + 140,
      y: y1 - 10
    },
    {
      type: 'Control',
      id: 'PCSel',
      name: 'psel',
      x: x1 + 130,
      y: y1 + 50,
      wid: 40,
      top: true,
    },
    {
      type: 'Latch',
      id: 'PC',
      name: 'PC',
      x: x1 + 250,
      y: y1 + 5,
      nbits: 7,
      resetValue: 0,
      visible: true,
    },
    {
      type: 'AndOr',
      id: 'LPC',
      x: x1 + 200,
      y: y1 + 95
    },
    {
      type: 'Control',
      id: 'FLdPC',
      name: 'fldpc',
      x: x1 + 130,
      y: y1 + 75,
      wid: 50,
      top: false,
    },
    {
      type: 'Control',
      id: 'CLdPC',
      name: 'cldpc',
      x: x1 + 130,
      y: y1 + 100,
      wid: 50,
      top: false,
    },
    {
      type: 'Expand',
      id: 'ExPCOut',
      x: x1 + 310,
      y: y1 + 45,
      inNBits: 7,
      outNBits: 12,
      extend: false
    },
    {
      type: 'Tristate',
      id: 'PC2A',
      x: x1 + 350,
      y: y1 - 40,
      flip: false
    },
    {
      type: 'Control',
      id: 'RdPCA',
      name: 'rdpca',
      x: x1 + 340,
      y: y1 + 10,
      wid: 50,
      top: true,
    },
    {
      type: 'Tristate',
      id: 'PC2B',
      x: x1 + 350,
      y: y1 + 50,
      flip: false
    },
    {
      type: 'Control',
      id: 'RdPCB',
      name: 'rdpcb',
      x: x1 + 340,
      y: y1 + 100,
      wid: 50,
      top: true,
    },

    // We insert this here so that it is displayed before Q and IR in the
    // programmer view.
    {
      type: 'Latch',
      id: 'ACC',
      name: 'ACC',
      x: x3 + 140,
      y: y3 + 80,
      nbits: 12,
      visible: true,
    },

    // TA and IR unit
    {
      type: 'Expand',
      id: 'ExS',
      x: x2 + 10,
      y: y2 - 25,
      inNBits: 12,
      outNBits: 7,
      extend: false
    },
    {
      type: 'Latch',
      id: 'S',
      name: 'S',
      x: x2 + 70,
      y: y2 - 10,
      nbits: 7
    },
    {
      type: 'Control',
      id: 'LdS',
      name: 'lds',
      x: x2 + 60,
      y: y2 + 50,
      wid: 40,
      top: true,
    },
    {
      type: 'Tristate',
      id: 'S2A',
      x: x2 + 130,
      y: y2 - 20,
      flip: false
    },
    {
      type: 'Control',
      id: 'RdS',
      name: 'rds',
      x: x2 + 125,
      y: y2 + 50,
      wid: 40,
      top: true,
    },
    {
      type: 'Latch',
      id: 'IR',
      name: 'IR',
      x: x2 + 10,
      y: y2 + 100,
      visible: true,
    },
    {
      type: 'Control',
      id: 'LdIR',
      name: 'ldir',
      x: x2,
      y: y2 + 160,
      wid: 40,
      top: true,
    },
    {
      type: 'Expand',
      id: 'ExIR',
      x: x2 + 80,
      y: y2 + 85,
      inNBits: 12,
      outNBits: 7,
      extend: false
    },
    {
      type: 'Tristate',
      id: 'IR2A',
      x: x2 + 150,
      y: y2 + 90,
      flip: false
    },
    {
      type: 'Control',
      id: 'RdIR',
      name: 'rdir',
      x: x2 + 145,
      y: y2 + 145,
      wid: 40,
      top: true,
    },
    {
      type: 'Decoder',
      id: 'Dec',
      x: x2 + 80,
      y: y2 + 145
    },

    // Arithmetic section
    {
      type: 'Latch',
      id: 'Q',
      name: 'Q',
      x: x3 + 10,
      y: y3 + 95,
      nbits: 12,
      visible: true,
    },
    {
      type: 'Control',
      id: 'LdQ',
      name: 'ldq',
      x: x3,
      y: y3 + 155,
      wid: 40,
      top: true,
    },
    {
      type: 'Mux',
      id: 'MAcc',
      x: x3 + 80,
      y: y3 + 65
    },
    {
      type: 'Control',
      id: 'ASel',
      name: 'asel',
      x: x3 + 70,
      y: y3 + 125,
      wid: 40,
      top: true,
    },
    {
      type: 'Control',
      id: 'LdA',
      name: 'lda',
      x: x3 + 130,
      y: y3 + 140,
      wid: 40,
      top: true,
    },
    {
      type: 'ALU',
      id: 'ALU',
      x: x3 + 210,
      y: y3 + 75,
      nbits: 12
    },
    {
      type: 'FlagLogic',
      id: 'Flags',
      x: x3 + 200,
      y: y3 + 25
    },
    {
      type: 'Control',
      id: 'AOp',
      name: 'op',
      x: x3 + 200,
      y: y3 + 175,
      wid: 60,
      top: true,
      options: ['ADD', 'AND', 'INC', 'INCB', 'DEC', 'DECB', 'CMA', 'NEG', 'RAL', 'RAR', 'ZERO', 'ONES']
    },
    {
      type: 'Control',
      id: 'FOp',
      name: 'fop',
      x: x3 + 120,
      y: y3 + 30,
      wid: 60,
      top: false,
      options: ['RDTZ', 'RDC', 'RDZ', 'RDN', 'RDV', 'RDNC', 'RDNZ', 'RDNN', 'RDNV', 'ROT', 'LDZ', 'LDALL', 'LDTZ', 'CLC', 'STC', 'CMC']
    },
    {
      type: 'Tristate',
      id: 'Acc2D',
      x: x3 + 310,
      y: y3 + 45,
      flip: false
    },
    {
      type: 'Control',
      id: 'RdA',
      name: 'rda',
      x: x3 + 305,
      y: y3 + 95,
      wid: 40,
      top: true,
    },
    {
      type: 'Mux',
      id: 'MT',
      x: x3 + 310,
      y: y3 + 135
    },
    {
      type: 'Control',
      id: 'TSel',
      name: 'tsel',
      x: x3 + 300,
      y: y3 + 195,
      wid: 40,
      top: true,
    },
    {
      type: 'Probe',
      id: 'ViewALU',
      x: x3 + 300,
      y: y3 + 10,
      wid: 80
    },
    {
      type: 'Latch',
      id: 'T',
      name: 'T',
      x: x3 + 360,
      y: y3 + 135,
      nbits: 12
    },
    {
      type: 'Control',
      id: 'LdT',
      name: 'ldt',
      x: x3 + 350,
      y: y3 + 195,
      wid: 40,
      top: true,
    },
    {
      type: 'Tristate',
      id: 'T2D',
      x: x3 + 420,
      y: y3 + 125,
      flip: false
    },
    {
      type: 'Control',
      id: 'RdT',
      name: 'rdt',
      x: x3 + 415,
      y: y3 + 175,
      wid: 40,
      top: true,
    },

    // Memory section
    {
      type: 'Tristate',
      id: 'ADrv',
      x: x0 + 680,
      y: y0 + 10,
      flip: false
    },
    {
      type: 'Control',
      id: 'AOut',
      name: 'aout',
      x: x0 + 675,
      y: y0 + 60,
      wid: 40,
      top: true,
    },
    {
      type: 'Tristate',
      id: 'DinDrv',
      x: x3 + 420,
      y: y3 + 40,
      flip: true
    },
    {
      type: 'Control',
      id: 'Din',
      name: 'din',
      x: x3 + 415,
      y: y3 + 85,
      wid: 40,
      top: true,
    },
    {
      type: 'Tristate',
      id: 'DoutDrv',
      x: x3 + 470,
      y: y3 + 10,
      flip: false
    },
    {
      type: 'Control',
      id: 'Dout',
      name: 'dout',
      x: x3 + 465,
      y: y3 + 85,
      wid: 40,
      top: true,
    },
    {
      type: 'MainMemory',
      id: 'Mem',
      x: x0 + 780,
      y: y0,
      databits: 12,
      addrbits: 7,
      addrY: 30,
      memrY: 110,
      memwY: 135,
      dataY: y3 + 30
    },
    {
      type: 'Control',
      id: 'MemR',
      name: 'memr',
      x: x0 + 675,
      y: y0 + 100,
      wid: 60,
      top: false,
    },
    {
      type: 'Control',
      id: 'MemW',
      name: 'memw',
      x: x0 + 675,
      y: y0 + 125,
      wid: 60,
      top: false,
    },
  ],
  wires: [
    { inputs: ['IncSel.out'], outputs: ['MIncSel.sel'], path: 'V' },
    { inputs: ['MIncSel.out'], outputs: ['Plus1.in'], path: 'H' },
    { inputs: ['PCSel.out'], outputs: ['MPC.sel'], path: 'V' },
    { inputs: ['Plus1.out'], outputs: ['MPC.in0'], path: 'H' },
    { inputs: ['ExPC.out'], outputs: ['MPC.in1'], path: 'HVH' },
    { inputs: ['MPC.out'], outputs: ['PC.in'], path: 'H' },
    { inputs: ['LPC.out'], outputs: ['PC.load'], path: 'HV' },
    { inputs: ['FLdPC.out'], outputs: ['LPC.in0'], path: 'HVH' },
    { inputs: ['CLdPC.out'], outputs: ['LPC.in1'], path: 'HVH' },
    { inputs: ['RdPCA.out'], outputs: ['PC2A.enable'], path: 'V' },
    { inputs: ['RdPCB.out'], outputs: ['PC2B.enable'], path: 'V' },
    { inputs: ['ExPCOut.out'], outputs: ['PC2B.in'], path: 'H' },
    {
      inputs: ['PC.out'],
      outputs: ['MIncSel.in0', 'PC2A.in', 'ExPCOut.in'],
      path: 'o 0 xy l 10 u 30 r 300 o 1 y i 0 y o 2 y o 2 xy ; i 0 xy r 20 ; o 1 xy l 50'
    },
    { inputs: ['ExS.out'], outputs: ['S.in'], path: 'H' },
    { inputs: ['LdS.out'], outputs: ['S.load'], path: 'V' },
    { inputs: ['RdS.out'], outputs: ['S2A.enable'], path: 'V' },
    { inputs: ['S.out'], outputs: ['S2A.in'], path: 'H' },
    { inputs: ['LdIR.out'], outputs: ['IR.load'], path: 'V' },
    { inputs: ['ExIR.out'], outputs: ['IR2A.in'], path: 'H' },
    { inputs: ['RdIR.out'], outputs: ['IR2A.enable'], path: 'V' },
    {
      inputs: ['IR.out'],
      outputs: ['ExIR.in', 'Dec.in'],
      path: 'i 0 xy r 20 ^ 0 xy o 0 xy ; $ 0 o 1 y o 1 xy'
    },
    { inputs: ['LdQ.out'], outputs: ['Q.load'], path: 'V' },
    { inputs: ['Q.out'], outputs: ['MAcc.in1'], path: 'H' },
    { inputs: ['ASel.out'], outputs: ['MAcc.sel'], path: 'V' },
    { inputs: ['LdA.out'], outputs: ['ACC.load'], path: 'V' },
    { inputs: ['MAcc.out'], outputs: ['ACC.in'], path: 'H' },
    { inputs: ['ALU.flags'], outputs: ['Flags.in'], path: 'HVH' },
    { inputs: ['AOp.out'], outputs: ['ALU.op'], path: 'V' },
    { inputs: ['FOp.out'], outputs: ['Flags.op'], path: 'H' },
    {
      inputs: ['Flags.out'],
      outputs: ['ALU.cin', 'LPC.in2'],
      path: 'i 0 xy u 10 ^ 0 xy r 40 d 150 o 0 x o 0 xy ; $ 0 o 1 x l 10 o 1 y o 1 xy'
    },
    { inputs: ['RdA.out'], outputs: ['Acc2D.enable'], path: 'V' },
    {
      inputs: ['ACC.out'],
      outputs: ['ALU.in0', 'Acc2D.in'],
      path: 'i 0 xy r 20 ^ 0 xy ^ 1 x o 0 xy ; o 1 xy $ 1 $ 0'
    },
    { inputs: ['TSel.out'], outputs: ['MT.sel'], path: 'V' },
    {
      inputs: ['ALU.out'],
      outputs: ['MT.in1', 'MAcc.in0', 'ViewALU.in'],
      path: 'o 1 xy l 20 u 70 r 220 ^ 0 x o 2 y i 0 y o 0 y o 0 xy ; i 0 xy $ 0 ; o 2 xy $ 0'
    },
    { inputs: ['LdT.out'], outputs: ['T.load'], path: 'V' },
    { inputs: ['MT.out'], outputs: ['T.in'], path: 'HVH' },
    { inputs: ['RdT.out'], outputs: ['T2D.enable'], path: 'V' },
    {
      inputs: ['T.out'],
      outputs: ['T2D.in', 'ALU.in1'],
      path: 'i 0 xy r 15 ^ 0 xy o 0 xy ; $ 0 d 80 l 215 o 1 y o 1 xy'
    },
    { inputs: ['AOut.out'], outputs: ['ADrv.enable'], path: 'V' },
    {
      inputs: ['PC2A.out', 'S2A.out', 'IR2A.out'],
      outputs: ['ADrv.in', 'MIncSel.in1'],
      path: 'i 0 xy r 20 o 0 y ^ 0 x ; i 2 xy r 20 i 1 y ^ 1 x ; i 1 xy $ 1 o 0 y ; o 1 xy l 20 o 0 y $ 0 $ 1 o 0 xy',
      // label: 'abus',
    },
    { inputs: ['Din.out'], outputs: ['DinDrv.enable'], path: 'V' },
    { inputs: ['Dout.out'], outputs: ['DoutDrv.enable'], path: 'V' },
    {
      inputs: ['Acc2D.out', 'PC2B.out', 'T2D.out', 'DinDrv.out'],
      outputs: ['Q.in', 'ExPC.in', 'ExS.in', 'IR.in', 'MT.in0', 'DoutDrv.in'],
      path: 'o 0 xy l 10 u 115 ^ 0 y ^ 2 xy ; o 1 xy l 20 $ 0 ^ 3 xy $ 2 ; o 4 xy l 20 $ 0 ^ 4 xy $ 3 ; o 3 xy l 30 ^ 1 x ^ 5 xy $ 0 ^ 6 xy $ 4 ; i 1 xy $ 1 ^ 7 xy $ 5 ; o 2 xy $ 1 $ 7 ; o 5 xy $ 1 ^ 8 xy $ 6 ; i 3 xy $ 1 ^ 9 xy $ 8 ; i 0 xy $ 1 ^ 10 xy $ 9 ; i 2 xy r 20 u 30 $ 1 $ 10',
      // label: 'dbus',
    },
    { inputs: ['ADrv.out'], outputs: ['Mem.addr'], path: 'H' },
    {
      inputs: ['DoutDrv.out', 'Mem.dout'],
      outputs: ['Mem.din', 'DinDrv.in'],
      path: 'o 1 xy r 70 i 0 y ^ 0 x ; i 1 xy l 20 i 0 y ^ 1 x ; i 0 xy $ 0 $ 1 o 0 xy'
    },
    { inputs: ['MemR.out'], outputs: ['Mem.memr'], path: 'H' },
    {
      inputs: ['MemW.out'],
      outputs: ['Mem.memw'],
      path: 'H'
    }
  ],
  microcode: {
    clockCycleNames: ['t0 (fetch)', 't1', 't2', 't3', 't4'],
    fetchCycleStep: 'rdpca,aout,memr,din,ldir',
    instructions: [
      'AND;rdir,aout,memr,din,ldt;op:AND,fop:LDZ,lda;fldpc',
      'ANDI;fldpc;rdpca,aout,memr,din,ldt;op:AND,fop:LDZ,lda;fldpc',
      'ANDR;rdir,aout,memr,din,lds;rds,aout,memr,din,ldt;op:AND,fop:LDZ,lda;fldpc',
      'TAD;rdir,aout,memr,din,ldt;op:ADD,fop:LDALL,lda;fldpc',
      'TADI;fldpc;rdir,aout,memr,din,ldt;op:ADD,fop:LDALL,lda;fldpc',
      'TADR;rdir,aout,memr,din,lds;rds,aout,memr,din,ldt;op:ADD,fop:LDALL,lda;fldpc',
      'ISZ;fldpc,rdir,aout,memr,din,ldt;op:INCB,fop:LDZ,tsel,ldt;rdir,aout,memw,rdt,dout,cldpc,fop:RDZ',
      'ISZR;fldpc,rdir,aout,memr,din,lds;rds,aout,memr,din,ldt;op:INCB,fop:LDZ,tsel,ldt;rds,aout,memw,rdt,dout,cldpc,fop:RDZ',
      'DCA;rdir,aout,memw,rda,dout;op:ZERO,lda;fldpc',
      'DCAR;rdir,aout,memr,din,lds;rds,aout,memw,rda,dout;op:ZERO,lda;fldpc',
      'JMS;fldpc;rdir,aout,memw,rdpcb,dout;rdir,incsel,fldpc',
      'JMSR;fldpc,rdir,aout,memr,din,lds;rds,aout,memw,rdpcb,dout;rds,incsel,fldpc',
      'JMP;rdir,incsel,fldpc;rdpcb,ldt;op:DECB,tsel,ldt;rdt,psel,fldpc',
      'JMPR;rdir,aout,memr,din,psel,fldpc',
      'NOP;fldpc',
      'IAC;op:INC,fop:LDALL,lda;fldpc',
      'RAL;op:RAL,fop:ROT,lda;fldpc',
      'RAR;op:RAR,fop:ROT,lda;fldpc',
      'CMA;op:CMA,lda;fldpc',
      'CIA;op:NEG,lda;fldpc',
      'CLA;op:ZERO,lda;fldpc',
      'STA;op:ONES,lda;fldpc',
      'CLC;fop:CLC;fldpc',
      'STC;fop:STC;fldpc',
      'CMC;fop:CMC;fldpc',
      'SKP;fldpc;fldpc',
      'SCC;fop:RDNC,cldpc;fldpc',
      'SCS;fop:RDC,cldpc;fldpc',
      'SZC;fop:RDNZ,cldpc;fldpc',
      'SZS;fop:RDZ,cldpc;fldpc',
      'SNC;fop:RDNN,cldpc;fldpc',
      'SNS;fop:RDN,cldpc;fldpc',
      'MQA;asel,lda;fldpc',
      'MQL;rda,ldq;fldpc',
      'SWP;rda,ldt;asel,lda;rdt,ldq;fldpc',
    ],
  }
};