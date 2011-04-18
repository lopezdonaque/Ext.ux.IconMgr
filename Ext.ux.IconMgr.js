
/**
 * Manages icon CSS classes to use as iconCls
 * Based on TDGi.iconMgr
 * 
 * @author Alberto López Doñaque (lopezdonaque@gmail.com)
 * @version 0.1
 * 
 * 
 * How to use:
 * 
 * Ext.ux.IconMgr.setIconsBase( 'silk', '/icons/silk' ); 
 * Ext.ux.IconMgr.setIconsBase( 'fugue', '/icons/fugue' );
 * 
 * iconCls: Ext.ux.IconMgr.getIconBase( 'silk', 'user.gif' )
 * 
 */
Ext.ux.IconMgr = 
{
    
  /**
   * Prefix constant 
   * 
   * @var string
   */
  PREFIX: 'IconMgr_',
    
    
  /**
   * Icons bases
   * 
   * For example:
   * 
   * {
   *   SilkBase: 
   *   {
   *     path: '/icons/silk',
   *     icons:
   *     {
   *       'user.gif': 
   *       {
   *         cssRule: 'IconMgr_SilkBase_1302873530548',
   *         styleTxt: '.IconMgr_SilkBase_1302873530548 { background-image: url( /icons/silk/user.gif ) !important; }'
   *       }
   *     }
   *   }
   * }
   * 
   * @var Object
   */
  _iconsBases: {},
  
  
  /**
   * CSS Rule body template
   * 
   * @var string
   */
  _ruleBodyTpl: ' \n\r .{0} { background-image: url( {1} ) !important; }',
   
  
  
  /**
   * Sets icons base
   * 
   * @param string name
   * @param string path
   * @return Object
   */
  setIconsBase: function( name, path )
  {
    if( ! this._iconsBases[ name ] )
    {
      var styleSheetId = this.PREFIX + name;  
      Ext.util.CSS.createStyleSheet( '/* IconMgr stylesheet */\n', styleSheetId );
    }
        
    this._iconsBases[ name ] = 
    {
      path: path,
      icons: {}   
    };
    
    return this._iconsBases;
  },
  
  
  
  /**
   * Returns the css class from icon base to use into iconCls
   * 
   * @param string baseName
   * @param string icon
   * @return string
   */
  getIconBase: function( baseName, icon )
  {
    // Check if icons base exists
    if( ! this._iconsBases[ baseName ] )
    {
      throw 'Icon base [' + baseName + '] not found';
    }
    
    // Check if icon css class has been already generated
    if( this._iconsBases[ baseName ].icons[ icon ] )
    {
      return this._iconsBases[ baseName ].icons[ icon ].cssRule;
    }
    
    // Generate icon css class
    return this._generateIconCSSRule( baseName, icon );
  },
  
  
  
  /**
   * Generates icon CSS rule
   * 
   * @param string baseName
   * @param string icon
   * @return string
   */  
  _generateIconCSSRule: function( baseName, icon )
  {
    // Generate icon css rule name
    var cls = this.PREFIX + baseName + '_' + new Date().getTime();
    
    // Get icon image path
    var iconImgPath = this._iconsBases[ baseName ].path + '/' + icon;
    
    // Generate style text
    var styleBody = String.format( this._ruleBodyTpl, cls, iconImgPath );
    
    // Store icon
    this._iconsBases[ baseName ].icons[ icon ] = 
    {
      cssRule: cls,
      styleText: styleBody
    };
    
    // Append CSS style text
    if( ! Ext.isIE )
    {
      var styleSheet = Ext.get( this.PREFIX + baseName );
      styleSheet.dom.sheet.insertRule( styleBody, styleSheet.dom.sheet.cssRules.length );
    }
    else
    {
      // Per http://www.quirksmode.org/dom/w3c_css.html#properties
      document.styleSheets[ this.PREFIX + baseName ].cssText += styleBody;
    }
    
    Ext.util.CSS.refreshCache();
      
    return cls; 
  }  
  
};
