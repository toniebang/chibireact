// src/components/DailyScheduleStrip.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Asegúrate de usar los iconos que SÍ te funcionen
import { FaRunning, FaDumbbell, FaLeaf, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const dailyTrainings = [
  {
    id: 1,
    day: 'Lunes',
    time: '07:00 AM',
    title: 'Cardio Extremo',
    description: 'Sesión de alta intensidad para quemar calorías.',
    icon: FaRunning,
  },
  {
    id: 2,
    day: 'Martes',
    time: '08:30 AM',
    title: 'Fuerza Total',
    description: 'Entrenamiento con pesas para construir músculo.',
    icon: FaDumbbell,
  },
  {
    id: 3,
    day: 'Miércoles',
    time: '07:00 PM',
    title: 'Yoga Flow',
    description: 'Relaja tu mente y fortalece tu cuerpo.',
    icon: FaLeaf, // Usando FaLeaf ya que FaYoga no funciona
  },
  {
    id: 4,
    day: 'Jueves',
    time: '06:00 AM',
    title: 'HIT Matutino',
    description: 'Entrenamiento interválico de alta intensidad.',
    icon: FaRunning,
  },
  {
    id: 5,
    day: 'Viernes',
    time: '05:00 PM',
    title: 'Full Body',
    description: 'Rutina completa para todo el cuerpo.',
    icon: FaDumbbell,
  },
  {
    id: 6,
    day: 'Sábado',
    time: '09:00 AM',
    title: 'Entrenamiento Funcional',
    description: 'Mejora tu movilidad y fuerza práctica.',
    icon: FaCalendarAlt,
  },
];

const DailyScheduleStrip = () => {
  const stripVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const renderTrainingCard = (training, index) => {
    const IconComponent = training.icon;
    return (
      <div
        key={`${training.id}-${index}`}
        // CLASES MODIFICADAS:
        // Se ha ELIMINADO 'rounded-lg' de aquí
        className="flex-shrink-0 w-64 p-4 bg-white text-gray-800 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center mb-2">
          {IconComponent && <IconComponent className="text-2xl mr-2 text-[var(--color-chibi-green)]" />}
          <h3 className="text-lg font-semibold">{training.day}</h3>
          <span className="ml-auto text-sm text-gray-600">{training.time}</span>
        </div>
        <h4 className="text-base font-medium mb-1">{training.title}</h4>
        <p className="text-xs text-gray-600 leading-tight">{training.description}</p>
        {/* Botón opcional - lo he comentado para un look más limpio, pero puedes descomentarlo */}
        {/* <button className="mt-3 inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 hover:bg-gray-200 transition-colors">
          Detalles <FaArrowRight className="ml-1 text-xs" />
        </button> */}
      </div>
    );
  };

  return (
    <motion.div
      className="relative w-full overflow-hidden bg-gray-100 py-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stripVariants}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Nuestro Horario de Entrenamientos Diarios</h2>

        <div className="flex space-x-4 pb-4 whitespace-nowrap animate-slide-infinite custom-scrollbar">
          {dailyTrainings.map((training, index) => renderTrainingCard(training, index))}
          {dailyTrainings.map((training, index) => renderTrainingCard(training, dailyTrainings.length + index))}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyScheduleStrip;