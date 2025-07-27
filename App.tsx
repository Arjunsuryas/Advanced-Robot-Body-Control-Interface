import React, { useState, useEffect } from 'react';
import RobotBody from './components/RobotBody';
import ControlPanel from './components/ControlPanel';
import StatusDisplay from './components/StatusDisplay';
import TrainingModule from './components/TrainingModule';
import AdvancedControls from './components/AdvancedControls';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import MissionControl from './components/MissionControl';
import { Bot, Sparkles, Zap } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  objectives: string[];
}

function App() {
  const [isActive, setIsActive] = useState(false);
  const [trainingMode, setTrainingMode] = useState(false);
  const [combatMode, setCombatMode] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [movementMode, setMovementMode] = useState('WALK');
  
  // System metrics
  const [powerLevel, setPowerLevel] = useState(85);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [temperature, setTemperature] = useState(42);
  const [networkStatus, setNetworkStatus] = useState('CONNECTED');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentExercise, setCurrentExercise] = useState('Motor Calibration');
  const [missionProgress, setMissionProgress] = useState(0);
  
  const [systemAlerts, setSystemAlerts] = useState<string[]>([]);
  
  // Advanced robot features
  const [jointPositions, setJointPositions] = useState({
    leftShoulder: 15,
    rightShoulder: 15,
    leftElbow: -30,
    rightElbow: -30,
    leftHip: 0,
    rightHip: 0,
    leftKnee: 0,
    rightKnee: 0
  });
  
  const [sensorData, setSensorData] = useState({
    vision: 95,
    lidar: 88,
    audio: 92,
    gyroscope: 97,
    accelerometer: 94,
    pressure: 89
  });
  
  const [systemHealth, setSystemHealth] = useState({
    motors: 92,
    sensors: 88,
    battery: 85,
    cooling: 94,
    network: 96,
    memory: 91
  });
  
  const [diagnosticResults, setDiagnosticResults] = useState({
    motorCalibration: 'PASS',
    sensorAlignment: 'PASS',
    batteryTest: 'WARN',
    networkConnectivity: 'PASS',
    memoryTest: 'PASS',
    coolingSystem: 'PASS'
  });
  
  const [errorLogs, setErrorLogs] = useState<string[]>([
    'Battery voltage slightly low',
    'Sensor recalibration recommended'
  ]);
  
  const [performanceMetrics, setPerformanceMetrics] = useState({
    maxSpeed: 2.5,
    batteryLife: 8.2,
    processingPower: 94.5,
    responseTime: 12.3,
    accuracy: 98.7,
    efficiency: 87.2
  });
  
  const [availableMissions] = useState<Mission[]>([
    {
      id: '1',
      name: 'Perimeter Patrol',
      status: 'pending',
      progress: 0,
      objectives: ['Navigate to checkpoint A', 'Scan for anomalies', 'Report status', 'Return to base']
    },
    {
      id: '2',
      name: 'Search & Rescue',
      status: 'pending',
      progress: 0,
      objectives: ['Deploy to search area', 'Scan for heat signatures', 'Locate targets', 'Coordinate rescue']
    },
    {
      id: '3',
      name: 'Facility Inspection',
      status: 'completed',
      progress: 100,
      objectives: ['Check all systems', 'Document findings', 'Generate report']
    }
  ]);
  
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);

  // Simulate realistic robot behavior
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        // Update system metrics with realistic variations
        setCpuUsage(prev => Math.max(10, Math.min(95, prev + (Math.random() - 0.5) * 8)));
        setTemperature(prev => Math.max(30, Math.min(85, prev + (Math.random() - 0.5) * 3)));
        setPowerLevel(prev => Math.max(0, prev - (combatMode ? 0.3 : trainingMode ? 0.2 : 0.1)));
        
        // Update sensor data
        setSensorData(prev => ({
          ...prev,
          vision: Math.max(70, Math.min(100, prev.vision + (Math.random() - 0.5) * 5)),
          lidar: Math.max(70, Math.min(100, prev.lidar + (Math.random() - 0.5) * 3)),
          audio: Math.max(70, Math.min(100, prev.audio + (Math.random() - 0.5) * 4))
        }));
        
        // Simulate joint movement during different modes
        if (movementMode === 'WALK') {
          setJointPositions(prev => ({
            ...prev,
            leftHip: Math.sin(Date.now() / 1000) * 15,
            rightHip: Math.sin(Date.now() / 1000 + Math.PI) * 15,
            leftKnee: Math.abs(Math.sin(Date.now() / 1000)) * 30,
            rightKnee: Math.abs(Math.sin(Date.now() / 1000 + Math.PI)) * 30
          }));
        }
      }
      
      if (isTraining) {
        setTrainingProgress(prev => Math.min(100, prev + 0.8));
      }
      
      if (currentMission && currentMission.status === 'active') {
        setMissionProgress(prev => Math.min(100, prev + 0.5));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, isTraining, combatMode, trainingMode, movementMode, currentMission]);

  // System status logic
  const getSystemStatus = () => {
    if (!isActive) return 'OFFLINE';
    if (currentMission?.status === 'active') return 'MISSION ACTIVE';
    if (trainingMode) return 'TRAINING MODE';
    if (combatMode) return 'COMBAT READY';
    return 'STANDBY';
  };

  const handleActivate = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPowerLevel(85);
      setSystemAlerts([]);
      setErrorLogs(prev => [...prev, 'System activated successfully']);
    } else {
      setTrainingMode(false);
      setCombatMode(false);
      setIsTraining(false);
      setCurrentMission(null);
      setErrorLogs(prev => [...prev, 'System shutdown initiated']);
    }
  };

  const handleTrainingToggle = () => {
    if (isActive) {
      setTrainingMode(!trainingMode);
      if (!trainingMode) {
        setCombatMode(false);
        setCurrentMission(null);
        setErrorLogs(prev => [...prev, 'Training mode activated']);
      }
    }
  };

  const handleCombatToggle = () => {
    if (isActive) {
      setCombatMode(!combatMode);
      if (!combatMode) {
        setTrainingMode(false);
        setCurrentMission(null);
        setSystemAlerts(['COMBAT MODE ACTIVATED', 'WEAPONS SYSTEMS ONLINE', 'THREAT DETECTION ACTIVE']);
        setErrorLogs(prev => [...prev, 'Combat mode engaged']);
      }
    }
  };

  const handleShieldToggle = () => {
    if (isActive) {
      setShieldActive(!shieldActive);
      if (!shieldActive) {
        setPowerLevel(prev => Math.max(0, prev - 15));
        setErrorLogs(prev => [...prev, 'Energy shield activated']);
      }
    }
  };

  const handleEmergencyStop = () => {
    setIsActive(false);
    setTrainingMode(false);
    setCombatMode(false);
    setShieldActive(false);
    setIsTraining(false);
    setCurrentMission(null);
    setSystemAlerts(['EMERGENCY STOP ACTIVATED', 'ALL SYSTEMS HALTED']);
    setErrorLogs(prev => [...prev, 'EMERGENCY STOP - All systems halted']);
  };

  const handleStartTraining = () => {
    if (trainingMode) {
      setIsTraining(true);
      setErrorLogs(prev => [...prev, `Training started: ${currentExercise}`]);
    }
  };

  const handlePauseTraining = () => {
    setIsTraining(false);
    setErrorLogs(prev => [...prev, 'Training paused']);
  };

  const handleResetTraining = () => {
    setIsTraining(false);
    setTrainingProgress(0);
    setErrorLogs(prev => [...prev, 'Training reset']);
  };

  const handleJointControl = (joint: string, value: number) => {
    if (isActive && !currentMission) {
      setJointPositions(prev => ({ ...prev, [joint]: value }));
    }
  };

  const handleNavigationCommand = (command: string) => {
    if (isActive) {
      setErrorLogs(prev => [...prev, `Navigation command: ${command}`]);
      // Simulate movement by adjusting joint positions
      if (command === 'FORWARD') {
        setMovementMode('WALK');
      }
    }
  };

  const handleStartMission = (missionId: string) => {
    const mission = availableMissions.find(m => m.id === missionId);
    if (mission && isActive) {
      setCurrentMission({ ...mission, status: 'active' });
      setMissionProgress(0);
      setTrainingMode(false);
      setCombatMode(false);
      setErrorLogs(prev => [...prev, `Mission started: ${mission.name}`]);
    }
  };

  const handlePauseMission = () => {
    if (currentMission) {
      setCurrentMission({ ...currentMission, status: 'pending' });
      setErrorLogs(prev => [...prev, 'Mission paused']);
    }
  };

  const handleAbortMission = () => {
    if (currentMission) {
      setCurrentMission(null);
      setMissionProgress(0);
      setErrorLogs(prev => [...prev, 'Mission aborted']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/8 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 p-4">
        {/* Enhanced Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Bot className="w-16 h-16 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEXUS ROBOT OS
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <p className="text-xl text-gray-300 font-mono">
                  Advanced Humanoid Control System v4.0
                </p>
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <Sparkles className="w-16 h-16 text-pink-400 animate-pulse" />
          </div>
        </div>

        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Primary Controls */}
            <div className="space-y-6">
              <ControlPanel
                isActive={isActive}
                trainingMode={trainingMode}
                combatMode={combatMode}
                shieldActive={shieldActive}
                onActivate={handleActivate}
                onTrainingToggle={handleTrainingToggle}
                onCombatToggle={handleCombatToggle}
                onShieldToggle={handleShieldToggle}
                onEmergencyStop={handleEmergencyStop}
              />
              
              <StatusDisplay
                powerLevel={powerLevel}
                cpuUsage={cpuUsage}
                temperature={temperature}
                networkStatus={networkStatus}
                systemAlerts={systemAlerts}
              />
            </div>

            {/* Center Left - Robot Body */}
            <div className="flex flex-col items-center justify-center">
              <RobotBody
                isActive={isActive}
                trainingMode={trainingMode}
                combatMode={combatMode}
                powerLevel={powerLevel}
                systemStatus={getSystemStatus()}
                jointPositions={jointPositions}
                sensorData={sensorData}
                movementMode={movementMode}
              />
              
              {/* Enhanced Status Badge */}
              <div className={`mt-6 px-8 py-3 rounded-full border-2 font-bold text-xl shadow-2xl ${
                isActive 
                  ? 'bg-green-600/20 border-green-400 text-green-400 shadow-green-500/50' 
                  : 'bg-red-600/20 border-red-400 text-red-400 shadow-red-500/50'
              }`}>
                {getSystemStatus()}
              </div>
              
              {/* Power Level Indicator */}
              <div className="mt-4 w-64 h-4 bg-gray-800 rounded-full border-2 border-cyan-400">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-500"
                  style={{ width: `${powerLevel}%` }}
                ></div>
              </div>
              <div className="text-cyan-400 font-mono mt-2">Power: {powerLevel.toFixed(1)}%</div>
            </div>

            {/* Center Right - Training & Advanced Controls */}
            <div className="space-y-6">
              <TrainingModule
                isTraining={isTraining}
                trainingProgress={trainingProgress}
                currentExercise={currentExercise}
                onStartTraining={handleStartTraining}
                onPauseTraining={handlePauseTraining}
                onResetTraining={handleResetTraining}
              />
              
              <AdvancedControls
                isActive={isActive}
                movementMode={movementMode}
                jointPositions={jointPositions}
                onMovementModeChange={setMovementMode}
                onJointControl={handleJointControl}
                onNavigationCommand={handleNavigationCommand}
              />
            </div>

            {/* Right Column - Diagnostics & Mission Control */}
            <div className="space-y-6">
              <MissionControl
                currentMission={currentMission}
                availableMissions={availableMissions}
                missionProgress={missionProgress}
                onStartMission={handleStartMission}
                onPauseMission={handlePauseMission}
                onAbortMission={handleAbortMission}
              />
              
              <DiagnosticsPanel
                systemHealth={systemHealth}
                diagnosticResults={diagnosticResults}
                errorLogs={errorLogs}
                performanceMetrics={performanceMetrics}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
