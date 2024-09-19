const PACKET_TYPES = {
    // login
    CQ_JoyGameLogin: 1114385,
    SA_JoyGameLogin: 1114386,
    // user
    SN_UserInfo: 2162945,
    SN_Record: 2162947,
    // envanter
    SN_ItemList: 2162961,
    SN_SlotInfo: 2162963,
    //server scane
    SN_ServerList: 2228488,
    SN_GroupList: 2228487,
    SN_ServerInfo: 2228481,
    SN_ChannelList: 2228482,
    // other
    SN_LockEnd: 2162977,
    CQ_AwayUser: 2228529,
    SA_AwayUser: 2228530,

};

module.exports = {
    PACKET_TYPES
};