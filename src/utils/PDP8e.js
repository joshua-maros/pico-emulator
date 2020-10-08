// src/utils/PDP8e.js - JSON structure for building the PDP8e Datapath

const x0 = 0;
const y0 = 0;
const x1 = x0 + 20;
const y1 = y0 + 100;
const x2 = x0 + 460;
const y2 = y0 + 80;
const x3 = x0 + 40;
const y3 = y0 + 260;

const PDP8e =
{
  size:{wid:1100, hgt:550},
  opcodes:[
    'AND', 'ANDI', 'ANDR', 'TAD', 'TADI', 'TADR', 'ISZ', 'ISZR',
    'DCA', 'DCAR', 'JMS', 'JMSR', 'JMP', 'JMPR', 'NOP', 'HLT',
    'IAC', 'RAL', 'RAR', 'CMA', 'CIA', 'CLA', 'STA', 'CLC', 'STC',
    'CMC', 'SKP', 'SCC', 'SCS', 'SZC', 'SZS', 'SNC', 'SNS',
    'MQA', 'MQL', 'SWP'
  ],
  cycles:['t0', 't1', 't2', 't3', 't4', 't5'],
  items:[
    // PC Unit
    {
      type:'DPMux',
      id:'MIncSel',
      x:x1 + 10,
      y:y1 - 25
    },
    {
      type:'DPControl',
      id:'IncSel',
      label:'incsel',
      name:'incsel',
      x:x1 - 5,
      y:y1 + 35,
      wid:50,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WIncSel',
      inputs:[{gate:'IncSel', pin:'Out'}],
      outputs:[{gate:'MIncSel', pin:'Sel'}],
      path:'V'
    },
    {
      type:'DPIncrementer',
      id:'Plus1',
      x:x1 + 70,
      y:y1 - 15,
      nbits:7,
      constant:1
    },
    {
      type:'DPWire',
      id:'PreInc',
      inputs:[{gate:'MIncSel', pin:'Out'}],
      outputs:[{gate:'Plus1', pin:'In'}],
      path:'H'
    },
    {
      type:'DPExpand',
      id:'ExPC',
      x:x1 + 80,
      y:y1 + 25,
      inNBits:12,
      outNBits:7,
      extend:false
    },
    {
      type:'DPMux',
      id:'MPC',
      x:x1 + 140,
      y:y1 - 10
    },
    {
      type:'DPControl',
      id:'PCSel',
      label:'psel',
      name:'psel',
      x:x1 + 130,
      y:y1 + 50,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WPCSel',
      inputs:[{gate:'PCSel', pin:'Out'}],
      outputs:[{gate:'MPC', pin:'Sel'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'PCIn1',
      inputs:[{gate:'Plus1', pin:'Out'}],
      outputs:[{gate:'MPC', pin:'In0'}],
      path:'H'
    },
    {
      type:'DPWire',
      id:'PCIn2',
      inputs:[{gate:'ExPC', pin:'Out'}],
      outputs:[{gate:'MPC', pin:'In1'}],
      path:'HVH'
    },
    {
      type:'DPLatch',
      id:'PC',
      label:'PC',
      x:x1 + 250,
      y:y1 + 5,
      nbits:7,
      powerOnReset:true
    },
    {
      type:'DPWire',
      id:'PCIn',
      inputs:[{gate:'MPC', pin:'Out'}],
      outputs:[{gate:'PC', pin:'In'}],
      path:'H'
    },
    {
      type:'DPAndOr',
      id:'LPC',
      x:x1 + 200,
      y:y1 + 95
    },
    {
      type:'DPWire',
      id:'WPC',
      inputs:[{gate:'LPC', pin:'Out'}],
      outputs:[{gate:'PC', pin:'Load'}],
      path:'HV'
    },
    {
      type:'DPControl',
      id:'FLdPC',
      label:'fldpc',
      name:'fldpc',
      x:x1 + 130,
      y:y1 + 75,
      wid:50,
      top:false,
      options:[]
    },
    {
      type:'DPControl',
      id:'CLdPC',
      label:'cldpc',
      name:'cldpc',
      x:x1 + 130,
      y:y1 + 100,
      wid:50,
      top:false,
      options:[]
    },
    {
      type:'DPWire',
      id:'WFlPC',
      inputs:[{gate:'FLdPC', pin:'Out'}],
      outputs:[{gate:'LPC', pin:'In0'}],
      path:'HVH'
    },
    {
      type:'DPWire',
      id:'WClPC',
      inputs:[{gate:'CLdPC', pin:'Out'}],
      outputs:[{gate:'LPC', pin:'In1'}],
      path:'HVH'
    },
    {
      type:'DPExpand',
      id:'ExPCOut',
      x:x1 + 310,
      y:y1 + 45,
      inNBits:7,
      outNBits:12,
      extend:false
    },
    {
      type:'DPTristate',
      id:'PC2A',
      x:x1 + 350,
      y:y1 - 40,
      flip:false
    },
    {
      type:'DPControl',
      id:'RdPCA',
      label:'rdpca',
      name:'rdpca',
      x:x1 + 340,
      y:y1 + 10,
      wid:50,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WRdPCA',
      inputs:[{gate:'RdPCA', pin:'Out'}],
      outputs:[{gate:'PC2A', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPTristate',
      id:'PC2B',
      x:x1 + 350,
      y:y1 + 50,
      flip:false
    },
    {
      type:'DPControl',
      id:'RdPCB',
      label:'rdpcb',
      name:'rdpcb',
      x:x1 + 340,
      y:y1 + 100,
      wid:50,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WRdPCB',
      inputs:[{gate:'RdPCB', pin:'Out'}],
      outputs:[{gate:'PC2B', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'WExPCO',
      inputs:[{gate:'ExPCOut', pin:'Out'}],
      outputs:[{gate:'PC2B', pin:'In'}],
      path:'H'
    },
    {
      type:'DPWire',
      id:'PCVal',
      inputs:[{gate:'PC', pin:'Out'}],
      outputs:[{gate:'MIncSel', pin:'In0'},{gate:'PC2A', pin:'In'},{gate:'ExPCOut', pin:'In'}],
      path:'o 0 xy l 10 u 30 r 300 o 1 y i 0 y o 2 y o 2 xy ; i 0 xy r 20 ; o 1 xy l 50'
    },

    // TA and IR unit
    {
      type:'DPExpand',
      id:'ExS',
      x:x2 + 10,
      y:y2 - 25,
      inNBits:12,
      outNBits:7,
      extend:false
    },
    {
      type:'DPLatch',
      id:'S',
      label:'S',
      x:x2 + 70,
      y:y2 - 10,
      nbits:7
    },
    {
      type:'DPWire',
      id:'SIn',
      inputs:[{gate:'ExS', pin:'Out'}],
      outputs:[{gate:'S', pin:'In'}],
      path:'H'
    },
    {
      type:'DPControl',
      id:'LdS',
      label:'lds',
      name:'lds',
      x:x2 + 60,
      y:y2 + 50,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'SLd',
      inputs:[{gate:'LdS', pin:'Out'}],
      outputs:[{gate:'S', pin:'Load'}],
      path:'V'
    },
    {
      type:'DPTristate',
      id:'S2A',
      x:x2 + 130,
      y:y2 - 20,
      flip:false
    },
    {
      type:'DPControl',
      id:'RdS',
      label:'rds',
      name:'rds',
      x:x2 + 125,
      y:y2 + 50,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WRdS',
      inputs:[{gate:'RdS', pin:'Out'}],
      outputs:[{gate:'S2A', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'WS',
      inputs:[{gate:'S', pin:'Out'}],
      outputs:[{gate:'S2A', pin:'In'}],
      path:'H'
    },
    {
      type:'DPLatch',
      id:'IR',
      label:'IR',
      x:x2 + 10,
      y:y2 + 100,
      nbits:7,
      isIR:true
    },
    {
      type:'DPControl',
      id:'LdIR',
      label:'ldir',
      name:'ldir',
      x:x2,
      y:y2 + 160,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'IRLd',
      inputs:[{gate:'LdIR', pin:'Out'}],
      outputs:[{gate:'IR', pin:'Load'}],
      path:'V'
    },
    {
      type:'DPExpand',
      id:'ExIR',
      x:x2 + 80,
      y:y2 + 85,
      inNBits:12,
      outNBits:7,
      extend:false
    },
    {
      type:'DPTristate',
      id:'IR2A',
      x:x2 + 150,
      y:y2 + 90,
      flip:false
    },
    {
      type:'DPWire',
      id:'WIR2Tri',
      inputs:[{gate:'ExIR', pin:'Out'}],
      outputs:[{gate:'IR2A', pin:'In'}],
      path:'H'
    },
    {
      type:'DPControl',
      id:'RdIR',
      label:'rdir',
      name:'rdir',
      x:x2 + 145,
      y:y2 + 145,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WRdIR',
      inputs:[{gate:'RdIR', pin:'Out'}],
      outputs:[{gate:'IR2A', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPDecoder',
      id:'Dec',
      x:x2 + 80,
      y:y2 + 145
    },
    {
      type:'DPWire',
      id:'WIRout',
      inputs:[{gate:'IR', pin:'Out'}],
      outputs:[{gate:'ExIR', pin:'In'}, {gate:'Dec', pin:'In'}],
      path:'i 0 xy r 20 ^ 0 xy o 0 xy ; $ 0 o 1 y o 1 xy'
    },

    // Arithmetic section
    {
      type:'DPLatch',
      id:'Q',
      label:'Q',
      x:x3 + 10,
      y:y3 + 95,
      nbits:12
    },
    {
      type:'DPControl',
      id:'LdQ',
      label:'ldq',
      name:'ldq',
      x:x3,
      y:y3 + 155,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'QLd',
      inputs:[{gate:'LdQ', pin:'Out'}],
      outputs:[{gate:'Q', pin:'Load'}],
      path:'V'
    },
    {
      type:'DPMux',
      id:'MAcc',
      x:x3 + 80,
      y:y3 + 65
    },
    {
      type:'DPWire',
      id:'Q2A',
      inputs:[{gate:'Q', pin:'Out'}],
      outputs:[{gate:'MAcc', pin:'In1'}],
      path:'H'
    },
    {
      type:'DPControl',
      id:'ASel',
      label:'asel',
      name:'asel',
      x:x3 + 70,
      y:y3 + 125,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WASel',
      inputs:[{gate:'ASel', pin:'Out'}],
      outputs:[{gate:'MAcc', pin:'Sel'}],
      path:'V'
    },
    {
      type:'DPLatch',
      id:'A',
      label:'A',
      x:x3 + 140,
      y:y3 + 80,
      nbits:12
    },
    {
      type:'DPControl',
      id:'LdA',
      label:'lda',
      name:'lda',
      x:x3 + 130,
      y:y3 + 140,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'ALd',
      inputs:[{gate:'LdA', pin:'Out'}],
      outputs:[{gate:'A', pin:'Load'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'AIn',
      inputs:[{gate:'MAcc', pin:'Out'}],
      outputs:[{gate:'A', pin:'In'}],
      path:'H'
    },
    {
      type:'DPALU',
      id:'ALU',
      x:x3 + 210,
      y:y3 + 75,
      nBits:12
    },
    {
      type:'DPFlagLogic',
      id:'Flags',
      x:x3 + 200,
      y:y3 + 25
    },
    {
      type:'DPWire',
      id:'WFlags',
      inputs:[{gate:'ALU', pin:'Flags'}],
      outputs:[{gate:'Flags', pin:'In'}],
      path:'V'
    },
    {
      type:'DPControl',
      id:'AOp',
      label:'op',
      name:'op',
      x:x3 + 200,
      y:y3 + 175,
      wid:60,
      top:true,
      options:['none', 'ADD', 'AND', 'INC', 'INCB', 'CMA', 'NEG', 'RAL', 'RAR', 'ZERO', 'ONES']
    },
    {
      type:'DPWire',
      id:'WAOp',
      inputs:[{gate:'AOp', pin:'Out'}],
      outputs:[{gate:'ALU', pin:'Op'}],
      path:'V'
    },
    {
      type:'DPControl',
      id:'FOp',
      label:'fop',
      name:'fop',
      x:x3 + 120,
      y:y3 + 30,
      wid:60,
      top:false,
      options:['none', 'RDTZ', 'RDC', 'RDZ', 'RDN', 'RDV', 'RDNC', 'RDNZ', 'RDNN', 'RDNV', 'ROT', 'LDZ', 'LDALL', 'LDTZ', 'CLC', 'STC', 'CMC']
    },
    {
      type:'DPWire',
      id:'WFOp',
      inputs:[{gate:'FOp', pin:'Out'}],
      outputs:[{gate:'Flags', pin:'Op'}],
      path:'H'
    },
    {
      type:'DPWire',
      id:'CFlag',
      inputs:[{gate:'Flags', pin:'Out'}],
      outputs:[{gate:'ALU', pin:'Cin'}, {gate:'LPC', pin:'In2'}],
      path:'i 0 xy u 10 ^ 0 xy r 40 d 150 o 0 x o 0 xy ; $ 0 o 1 x l 10 o 1 y o 1 xy'
    },
    {
      type:'DPTristate',
      id:'Acc2D',
      x:x3 + 310,
      y:y3 + 45,
      flip:false
    },
    {
      type:'DPControl',
      id:'RdA',
      label:'rda',
      name:'rda',
      x:x3 + 305,
      y:y3 + 95,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WRdA',
      inputs:[{gate:'RdA', pin:'Out'}],
      outputs:[{gate:'Acc2D', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'WAccOut',
      inputs:[{gate:'A', pin:'Out'}],
      outputs:[{gate:'ALU', pin:'In0'}, {gate:'Acc2D', pin:'In'}],
      path:'i 0 xy r 20 ^ 0 xy ^ 1 x o 0 xy ; o 1 xy $ 1 $ 0'
    },
    {
      type:'DPMux',
      id:'MT',
      x:x3 + 310,
      y:y3 + 135
    },
    {
      type:'DPControl',
      id:'TSel',
      label:'tsel',
      name:'tsel',
      x:x3 + 300,
      y:y3 + 195,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WTSel',
      inputs:[{gate:'TSel', pin:'Out'}],
      outputs:[{gate:'MT', pin:'Sel'}],
      path:'V'
    },
    {
      type:'DPProbe',
      id:'ViewALU',
      x:x3 + 300,
      y:y3 + 10,
      wid:80
    },
    {
      type:'DPWire',
      id:'WALUOut',
      inputs:[{gate:'ALU', pin:'Out'}],
      outputs:[{gate:'MT', pin:'In1'}, {gate:'MAcc', pin:'In0'},{gate:'ViewALU', pin:'In'}],
      path:'o 1 xy l 20 u 70 r 220 ^ 0 x o 2 y i 0 y o 0 y o 0 xy ; i 0 xy $ 0 ; o 2 xy $ 0'
    },
    {
      type:'DPLatch',
      id:'T',
      label:'T',
      x:x3 + 360,
      y:y3 + 135,
      nbits:12
    },
    {
      type:'DPControl',
      id:'LdT',
      label:'ldt',
      name:'ldt',
      x:x3 + 350,
      y:y3 + 195,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'TLd',
      inputs:[{gate:'LdT', pin:'Out'}],
      outputs:[{gate:'T', pin:'Load'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'TIn',
      inputs:[{gate:'MT', pin:'Out'}],
      outputs:[{gate:'T', pin:'In'}],
      path:'HVH'
    },
    {
      type:'DPTristate',
      id:'T2D',
      x:x3 + 420,
      y:y3 + 125,
      flip:false
    },
    {
      type:'DPControl',
      id:'RdT',
      label:'rdt',
      name:'rdt',
      x:x3 + 415,
      y:y3 + 175,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WRdT',
      inputs:[{gate:'RdT', pin:'Out'}],
      outputs:[{gate:'T2D', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'WALUin1',
      inputs:[{gate:'T', pin:'Out'}],
      outputs:[{gate:'T2D', pin:'In'}, {gate:'ALU', pin:'In1'}],
      path:'i 0 xy r 15 ^ 0 xy o 0 xy ; $ 0 d 80 l 215 o 1 y o 1 xy'
    },

    // Memory section
    {
      type:'DPTristate',
      id:'ADrv',
      x:x0 + 680,
      y:y0 + 10,
      flip:false
    },
    {
      type:'DPControl',
      id:'AOut',
      label:'aout',
      name:'aout',
      x:x0 + 675,
      y:y0 + 60,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WAOut',
      inputs:[{gate:'AOut', pin:'Out'}],
      outputs:[{gate:'ADrv', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'ABus',
      inputs:[{gate:'PC2A', pin:'Out'}, {gate:'S2A', pin:'Out'}, {gate:'IR2A', pin:'Out'}],
      outputs:[{gate:'ADrv', pin:'In'}, {gate:'MIncSel', pin:'In1'}],
      path:'i 0 xy r 20 o 0 y ^ 0 x ; i 2 xy r 20 i 1 y ^ 1 x ; i 1 xy $ 1 o 0 y ; o 1 xy l 20 o 0 y $ 0 $ 1 o 0 xy',
      label:'abus',
      x:x0 + 160,
      y:y0 + 25
    },
    {
      type:'DPTristate',
      id:'DinDrv',
      x:x3 + 420,
      y:y3 + 40,
      flip:true
    },
    {
      type:'DPControl',
      id:'Din',
      label:'din',
      name:'din',
      x:x3 + 415,
      y:y3 + 85,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WDin',
      inputs:[{gate:'Din', pin:'Out'}],
      outputs:[{gate:'DinDrv', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPTristate',
      id:'DoutDrv',
      x:x3 + 470,
      y:y3 + 10,
      flip:false
    },
    {
      type:'DPControl',
      id:'Dout',
      label:'dout',
      name:'dout',
      x:x3 + 465,
      y:y3 + 85,
      wid:40,
      top:true,
      options:[]
    },
    {
      type:'DPWire',
      id:'WDout',
      inputs:[{gate:'Dout', pin:'Out'}],
      outputs:[{gate:'DoutDrv', pin:'Enable'}],
      path:'V'
    },
    {
      type:'DPWire',
      id:'WDBus',
      inputs:[{gate:'Acc2D', pin:'Out'}, {gate:'PC2B', pin:'Out'},
        {gate:'T2D', pin:'Out'}, {gate:'DinDrv', pin:'Out'}],
      outputs:[{gate:'Q', pin:'In'}, {gate:'ExPC', pin:'In'},
        {gate:'ExS', pin:'In'}, {gate:'IR', pin:'In'},
        {gate:'MT', pin:'In0'}, {gate:'DoutDrv', pin:'In'}],
      path:'o 0 xy l 10 u 115 ^ 0 y ^ 2 xy ; o 1 xy l 20 $ 0 ^ 3 xy $ 2 ; o 4 xy l 20 $ 0 ^ 4 xy $ 3 ; o 3 xy l 30 ^ 1 x ^ 5 xy $ 0 ^ 6 xy $ 4 ; i 1 xy $ 1 ^ 7 xy $ 5 ; o 2 xy $ 1 $ 7 ; o 5 xy $ 1 ^ 8 xy $ 6 ; i 3 xy $ 1 ^ 9 xy $ 8 ; i 0 xy $ 1 ^ 10 xy $ 9 ; i 2 xy r 20 u 30 $ 1 $ 10',
      label:'dbus',
      x:x0 + 160,
      y:y3 - 15
    },
    {
      type:'DPMainMemory',
      id:'Mem',
      label:'Mem',
      x:x0 + 780,
      y:y0,
      databits:12,
      addrbits:7,
      addrY:30,
      memrY:110,
      memwY:135,
      dataY:y3 + 30
    },
    {
      type:'DPWire',
      id:'Address',
      inputs:[{gate:'ADrv', pin:'Out'}],
      outputs:[{gate:'Mem', pin:'Addr'}],
      path:'H'
    },
    {
      type:'DPWire',
      id:'Data',
      inputs:[{gate:'DoutDrv', pin:'Out'},{gate:'Mem', pin:'Dout'}],
      outputs:[{gate:'Mem', pin:'Din'},{gate:'DinDrv', pin:'In'}],
      path:'o 1 xy r 70 i 0 y ^ 0 x ; i 1 xy l 20 i 0 y ^ 1 x ; i 0 xy $ 0 $ 1 o 0 xy'
    },
    {
      type:'DPControl',
      id:'MemR',
      label:'memr',
      name:'memr',
      x:x0 + 675,
      y:y0 + 100,
      wid:60,
      top:false,
      options:[]
    },
    {
      type:'DPWire',
      id:'Wmemr',
      inputs:[{gate:'MemR', pin:'Out'}],
      outputs:[{gate:'Mem', pin:'Memr'}],
      path:'H'
    },
    {
      type:'DPControl',
      id:'MemW',
      label:'memw',
      name:'memw',
      x:x0 + 675,
      y:y0 + 125,
      wid:60,
      top:false,
      options:[]
    },
    {
      type:'DPWire',
      id:'Wmemw',
      inputs:[{gate:'MemW', pin:'Out'}],
      outputs:[{gate:'Mem', pin:'Memw'}],
      path:'H'
    },
  ]
};

export default PDP8e;
