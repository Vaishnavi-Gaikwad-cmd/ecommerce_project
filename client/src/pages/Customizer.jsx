import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { updateAccount } from '../store/account';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');

  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [size, setSize] = useState(snap.selectedSize);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch(config.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  const addToCart = () => {
    state.cart.push({
      id: `${snap.selectedProduct.id}-${Date.now()}`,
      name: snap.selectedProduct.name,
      price: snap.selectedProduct.price,
      size,
      color: snap.color,
      accent: snap.selectedProduct.accent,
      quantity: 1,
    });
    state.selectedSize = size;
    if (state.user?.role === 'customer') updateAccount(state.user.email, { cart: [...state.cart] });
    state.screen = 'cart';
  };

  const saveInspiration = () => {
    if (!snap.user || snap.user.role !== 'customer') return;
    const inspiration = { id: `inspo-${Date.now()}`, name: 'Custom shirt idea', image: snap.logoDecal };
    const inspirations = [...state.inspirations, inspiration];
    state.inspirations = inspirations;
    updateAccount(snap.user.email, { inspirations });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <div className="customizer-actions">
              <button className="customizer-bag" onClick={() => { state.screen = 'cart'; }}>Bag ({snap.cart.length})</button>
              <CustomButton type="outline" title="Exit" handleClick={() => { state.screen = 'shop'; state.intro = true; }} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
            </div>
          </motion.div>

          <motion.div className="add-to-bag-panel" {...fadeAnimation}>
            <div><p className="eyebrow">{snap.selectedProduct.name}</p><strong>₹{snap.selectedProduct.price.toLocaleString('en-IN')}</strong></div>
            <div className="size-picker"><span>Size</span>{['S', 'M', 'L', 'XL'].map((option) => <button key={option} className={size === option ? 'selected' : ''} onClick={() => setSize(option)}>{option}</button>)}</div>
            <div className="customizer-panel-actions"><button className="primary-action" onClick={addToCart}>Add to bag <span>-&gt;</span></button>{snap.user?.role === 'customer' && <button className="save-inspiration" onClick={saveInspiration}>Save inspo</button>}</div>
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer