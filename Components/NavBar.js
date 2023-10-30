import { Text, TouchableOpacity, View } from 'react-native';
import { ProfielPic } from './ProfilePic';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../Providers/UserProvider';
import { Colors } from '../Constants/Colors';
import { width } from '../utils/UseDimensoins';
import { ROLES } from '../Constants/Roles';
import { useSetNavBar } from '../Providers/ShowNavBarProvider';
import { HomeSVG } from './SVG/Icons/HomeSVG';
import { SearchSVG } from './SVG/Icons/SearchSVG';
import { QuestionsSVG } from './SVG/Icons/QuestionsSVG';
import { GoalsSVG } from './SVG/Icons/GoalsSVG';
import { BoldText } from './Text/BoldText';
import { MediumText } from './Text/MediumText';

export const NavBar = ({ state, descriptors, navigation }) => {
	const { user } = useUser();

	const { showNavBar } = useSetNavBar();

	if (showNavBar) {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 30,
					position: 'absolute',
					bottom: 10,
					width: width,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: Colors.primary.bleuBottom,
						borderTopEndRadius: 100,
						borderBottomEndRadius: 100,
						padding: 5,
						alignItems: 'center',
					}}
				>
					{state.routes.map((route, index) => {
						if (route.name !== 'Profile' && route.name !== 'Editor') {
							const { options } = descriptors[route.key];
							const label =
								options.tabBarLabel !== undefined
									? options.tabBarLabel
									: options.title !== undefined
									? options.title
									: route.name;

							const isFocused = state.index === index;

							const onPress = () => {
								const event = navigation.emit({
									type: 'tabPress',
									target: route.key,
									canPreventDefault: true,
								});

								if (!isFocused && !event.defaultPrevented) {
									// The `merge: true` option makes sure that the params inside the tab screen are preserved
									navigation.navigate({ name: route.name, merge: true });
								}
							};

							let icon;

							switch (route.name) {
								case 'Home':
									icon = <HomeSVG isActive={isFocused} />;
									break;

								case 'Search':
									icon = <SearchSVG isActive={isFocused} />;
									break;

								case 'Questions':
									icon = <QuestionsSVG isActive={isFocused} />;
									break;

								case 'Goals':
									icon = <GoalsSVG isActive={isFocused} />;
									break;

								default:
									break;
							}

							return (
								<TouchableOpacity
									accessibilityRole='button'
									accessibilityState={isFocused ? { selected: true } : {}}
									accessibilityLabel={options.tabBarAccessibilityLabel}
									testID={options.tabBarTestID}
									onPress={onPress}
									style={{ marginHorizontal: 15 }}
								>
									{icon}
								</TouchableOpacity>
							);
						}
					})}
				</View>
				{state.routes.map((route, index) => {
					if (route.name === 'Profile') {
						const { options } = descriptors[route.key];

						const isFocused = state.index === index;

						const addButton = state.routes[state.routes.length - 1];

						const isAddFocused = state.index === state.routes.length - 1;

						const onPress = () => {
							const event = navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							});

							if (!isFocused && !event.defaultPrevented) {
								// The `merge: true` option makes sure that the params inside the tab screen are preserved
								navigation.navigate({ name: route.name, merge: true });
							}
						};

						const onPressAdd = () => {
							const event = navigation.emit({
								type: 'tabPress',
								target: addButton.key,
								canPreventDefault: true,
							});

							if (!isAddFocused && !event.defaultPrevented) {
								// The `merge: true` option makes sure that the params inside the tab screen are preserved
								navigation.navigate({ name: addButton.name, merge: true });
							}
						};

						return (
							<View
								style={{
									paddingRight: 25,
									backgroundColor: Colors.primary.bleuBottom,
									paddingVertical: 5,
									paddingLeft: 5,
									borderTopStartRadius: 100,
									borderBottomStartRadius: 100,

									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<TouchableOpacity
									accessibilityRole='button'
									accessibilityState={isFocused ? { selected: true } : {}}
									accessibilityLabel={options.tabBarAccessibilityLabel}
									testID={options.tabBarTestID}
									onPress={onPress}
								>
									<ProfielPic img={user ? user.profilePic : 'null'} size={35} />
								</TouchableOpacity>

								{user.role === ROLES.CREATOR && (
									<TouchableOpacity
										style={{ marginLeft: 10 }}
										accessibilityRole='button'
										onPress={onPressAdd}
									>
										{/* <Image /> */}
										<MediumText
											style={{ color: Colors.primary.lightBleu, fontSize: 30 }}
										>
											+
										</MediumText>
									</TouchableOpacity>
								)}
							</View>
						);
					}
				})}
			</View>
		);
	} else {
		return null;
	}
};
